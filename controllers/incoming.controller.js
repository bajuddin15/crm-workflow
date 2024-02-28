import axios from "axios";
import Workflow from "../models/workflow.model.js";
import WorkflowHistory from "../models/workflowHistory.model.js";
import { calculateTimeInMillis } from "../utils/common.js";

const incomingMessage = async (req, res) => {
  const {
    msgId,
    toNumber,
    fromNumber,
    message,
    mediaUrl,
    channel,
    email,
    contactName,
    groupName,
    phoneNumber,
    templateName,
    templateLang,
  } = req.body;

  // take token from fromNumber - suppose we have this token
  const getTokenUri = `https://app.crm-messaging.cloud/index.php/api/fetch-token?provider_number=${fromNumber}`;
  const { data } = await axios.get(getTokenUri);
  console.log("token", data);
  const token = data?.token;
  if (!token) {
    return res.status(404).json({ success: false, message: "Token not found" });
  }
  try {
    const workflows = await Workflow.find({
      token,
      status: "publish",
    }).populate(["triggers", "actions"]);

    const url = "https://app.crm-messaging.cloud/index.php/Api/sendMsg/";
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    let workflowHistoryId;

    for (let i = 0; i < workflows.length; i++) {
      let myworkflow = workflows[i];
      let triggers = myworkflow.triggers;
      let actions = myworkflow.actions;

      for (let j = 0; j < actions.length; j++) {
        let action = actions[j];

        // waiting history
        const history = new WorkflowHistory({
          contact: toNumber,
          status: "waiting",
          actionId: action._id,
          workflowId: myworkflow._id,
        });
        await history.save();
        workflowHistoryId = history._id;

        const actionFormData = {
          toNumber:
            action?.toNumber === "{{toNumber}}" ? toNumber : action?.toNumber,
          fromNumber:
            action?.fromNumber === "{{fromNumber}}"
              ? fromNumber
              : action?.fromNumber,
          message:
            action?.message === "{{message}}" ? message : action?.message,
          mediaUrl:
            action?.mediaUrl === "{{mediaUrl}}" ? mediaUrl : action?.mediaUrl,
          email: action?.email === "{{email}}" ? email : action?.email,
          phoneNumber:
            action?.phoneNumber === "{{phoneNumber}}"
              ? phoneNumber
              : action?.phoneNumber,
          contactName:
            action?.contactName === "{{contactName}}"
              ? contactName
              : action?.contactName,
          groupName:
            action?.groupName === "{{groupName}}"
              ? groupName
              : action?.groupName,
          templateName:
            action?.templateName === "{{templateName}}"
              ? templateName
              : action?.templateName,
          templateLang:
            action?.templateLang === "{{templateLang}}"
              ? templateLang
              : action?.templateLang,
          channel,
        };

        const formData = new FormData();

        if (action.unqName === "delay") {
          // delay if i have delay action
          // Define the delay in milliseconds (2 days = 2 * 24 * 60 * 60 * 1000 milliseconds)
          if (action?.delayFormate === "{{delayFormate}}") {
            break;
          }
          const delayMilliseconds = calculateTimeInMillis(
            action.delayTime,
            action.delayFormate
          );
          console.log("delay time in ms --", {
            delayMilliseconds,
            timeval: action.delayTime,
            timeformate: action.delayFormate,
          });
          await new Promise((resolve) =>
            setTimeout(resolve, delayMilliseconds)
          );
        } else if (action.unqName === "sendSMS" && channel === "sms") {
          formData.append("to", actionFormData.toNumber);
          formData.append("fromnum", actionFormData.fromNumber);
          formData.append("msg", actionFormData.message);
          formData.append("channel", actionFormData.channel);
          if (actionFormData.mediaUrl) {
            formData.append("mediaUrl", actionFormData.mediaUrl);
          }
          const { data } = await axios.post(url, formData, { headers });
          if (data && data.status !== 200) {
            if (workflowHistoryId) {
              await WorkflowHistory.findByIdAndUpdate(
                workflowHistoryId,
                { status: "failed" },
                { new: true }
              );
            }
            return res
              .status(409)
              .json({ success: false, message: "Action failed." });
          } else if (data && data.status === 200) {
            if (workflowHistoryId) {
              await WorkflowHistory.findByIdAndUpdate(
                workflowHistoryId,
                { status: "finshed" },
                { new: true }
              );
            }
          }
          console.log("send sms resp--", data);
        } else if (
          (action.unqName === "sendWhatsAppTemplates" ||
            action.unqName === "sendWhatsAppNonTemplates") &&
          channel === "whatsapp"
        ) {
          // yaha action.unqName whatsapp hoga
          // similar conditions for other action
          formData.append("to", actionFormData.toNumber);
          formData.append("fromnum", actionFormData.fromNumber);
          formData.append("msg", actionFormData.message);
          formData.append("channel", actionFormData.channel);
          formData.append("mediaUrl", actionFormData.mediaUrl);

          if (action.unqName === "sendWhatsAppTemplates") {
            formData.append("tempName", actionFormData.templateName);
          }
          const { data } = await axios.post(url, formData, { headers });
          if (data && data.status !== 200) {
            if (workflowHistoryId) {
              await WorkflowHistory.findByIdAndUpdate(
                workflowHistoryId,
                { status: "failed" },
                { new: true }
              );
            }
            return res
              .status(409)
              .json({ success: false, message: "Action failed." });
          } else if (data && data.status === 200) {
            if (workflowHistoryId) {
              await WorkflowHistory.findByIdAndUpdate(
                workflowHistoryId,
                { status: "finshed" },
                { new: true }
              );
            }
          }
          console.log("incoming msg whatsapp resp---", {
            data,
            formData,
            actionFormData,
          });
        }
        //  else if (action.unqName === "addContact") {
        //   // add contact logic here
        // }
      }
    }

    res.status(200).json({
      success: true,
      message: "Data received",
      workflows,
    });
  } catch (error) {
    console.log(`Incoming controller error : `, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { incomingMessage };

// incoming logic workflow
/*
Logic is -
in your backend function api/incoming 
Step 1- check for fromnum
Step 2- Call CRM Messaging API to get token against fromnum
Step 3- Check in mongoDB for published workflows against that token
Step 4- Find workflow that meet channel criteria 
Step 5- Read what actions needs to be taken, take actions.


const data = qs.stringify({
    to: toNumber,
    msg: message,
    fromnum: defaultIdVal,
    tempName: unqName,
    channel: channel,
    mediaUrl: mediaLink || attachmentValue,
  });
*/
