import axios from "axios";
import FormData from "form-data";
import Workflow from "../models/workflow.model.js";
import WorkflowHistory from "../models/workflowHistory.model.js";
import { calculateTimeInMillis } from "../utils/common.js";

const incomingMessage = async (req, res) => {
  const {
    msgId,
    to: toNumber,
    from: fromNumber,
    msg: message,
    media: mediaUrl,
    channel,
    email,
    contactName,
    groupName,
    phoneNumber,
    templateName,
    templateLang,
  } = req.body;

  console.log("Req Body Data ---", req.body);

  // take token from fromNumber - suppose we have this token
  const getTokenUri = `https://app.crm-messaging.cloud/index.php/api/fetch-token?provider_number=${toNumber}`;
  let token;
  try {
    const { data } = await axios.get(getTokenUri);
    console.log("token", data);
    token = data?.token;
    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "Token not found" });
    }
  } catch (error) {
    console.error("Error fetching token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
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

    await Promise.all(
      workflows.map(async (myworkflow) => {
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
            fromNumber:
              (action?.toNumber === "{{fromNumber}}"
                ? toNumber
                : action?.toNumber) || toNumber,
            toNumber:
              (action?.fromNumber === "{{toNumber}}"
                ? fromNumber
                : action?.fromNumber) || fromNumber,
            message:
              action?.message === "{{message}}" ? message : action?.message,
            mediaUrl:
              (action?.mediaUrl === "{{mediaUrl}}"
                ? mediaUrl
                : action?.mediaUrl) || "",
            email:
              action?.email === "{{contact.email}}" ? email : action?.email,
            phoneNumber:
              action?.phoneNumber === "{{contact.phoneNumber}}"
                ? phoneNumber || fromNumber
                : action?.phoneNumber,
            contactName:
              action?.contactName === "{{contact.name}}"
                ? contactName
                : action?.contactName,
            groupName:
              action?.groupName === "{{contact.groupName}}"
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
            // delay if I have delay action
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
            if (workflowHistoryId) {
              await WorkflowHistory.findByIdAndUpdate(
                workflowHistoryId,
                { status: "finshed" },
                { new: true }
              );
            }
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
            console.log("incoming msg whatsapp resp---", {
              data,
              formData,
              actionFormData,
            });
            if (data && data.status !== 200) {
              if (workflowHistoryId) {
                await WorkflowHistory.findByIdAndUpdate(
                  workflowHistoryId,
                  { status: "failed" },
                  { new: true }
                );
              }
            } else if (data && data.status === 200) {
              if (workflowHistoryId) {
                await WorkflowHistory.findByIdAndUpdate(
                  workflowHistoryId,
                  { status: "finshed" },
                  { new: true }
                );
              }
            }
          } else if (action.unqName === "addContact") {
            // add contact logic here
            const url =
              "https://app.crm-messaging.cloud/index.php/Api/createContact";
            const headers = {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            };

            const nameParts = actionFormData?.contactName?.split(" ");
            const fname = nameParts.length > 0 ? nameParts[0] : "";
            const lname =
              nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
            const formData = new FormData();
            formData.append("phone", actionFormData?.phoneNumber);
            formData.append("fname", fname);
            formData.append("lname", lname);
            formData.append("email", email);

            try {
              const { data } = await axios.post(url, formData, { headers });
              if (data && data.status !== 200) {
                if (workflowHistoryId) {
                  await WorkflowHistory.findByIdAndUpdate(
                    workflowHistoryId,
                    { status: "failed" },
                    { new: true }
                  );
                }
              } else if (data && data.status === 200) {
                if (workflowHistoryId) {
                  await WorkflowHistory.findByIdAndUpdate(
                    workflowHistoryId,
                    { status: "finished" },
                    { new: true }
                  );
                }
              }
              console.log("add contact resp ----", { data, actionFormData });
            } catch (error) {
              console.error("Error adding contact:", error);
              if (workflowHistoryId) {
                await WorkflowHistory.findByIdAndUpdate(
                  workflowHistoryId,
                  { status: "failed" },
                  { new: true }
                );
              }
              return res
                .status(500)
                .json({ success: false, message: "Failed to add contact." });
            }
          }
        }
      })
    );

    res.status(200).json({
      success: true,
      message: "Data received",
      workflows,
    });
  } catch (error) {
    console.error("Incoming controller error:", error);
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
