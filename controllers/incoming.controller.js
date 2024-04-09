import axios from "axios";
import FormData from "form-data";
import Workflow from "../models/workflow.model.js";
import WorkflowHistory from "../models/workflowHistory.model.js";
import { calculateTimeInMillis } from "../utils/common.js";
import { getProviderDetails, getTokenFromNumber } from "../utils/api.js";

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
        const triggers = myworkflow.triggers;
        let actions = myworkflow.actions;
        const apiResponse = myworkflow.apiResponse;

        if (triggers?.length === 0) {
          return res
            .status(409)
            .json({ success: false, message: "You have not any trigger" });
        }

        const myTrigger = triggers[0];

        if (
          (myTrigger?.unqName === "incomingSMS" && channel === "whatsapp") ||
          (myTrigger?.unqName === "incomingWhatsApp" && channel === "sms")
        ) {
          return;
        }

        for (let j = 0; j < actions.length; j++) {
          let action = actions[j];

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
            voiceText:
              action?.voiceText === "{{voiceText}}"
                ? req.body?.voiceText
                : action?.voiceText,
          };

          // waiting history
          const history = new WorkflowHistory({
            contact: actionFormData?.toNumber,
            status: "waiting",
            actionId: action._id,
            workflowId: myworkflow._id,
          });
          await history.save();
          workflowHistoryId = history._id;

          console.log(
            "action form data which is used in action exectutation -- ",
            actionFormData
          );

          const formData = new FormData();
          console.log("unqname of action : ", action.unqName);

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
            console.log("send sms resp--", { data, formData });
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
          } else if (action.unqName === "outgoingVoiceCall") {
            let formData = {
              to: actionFormData?.toNumber,
              from: actionFormData?.fromNumber,
              text: actionFormData?.voiceText,
            };

            // const token = await getTokenFromNumber(formData?.from);

            if (token) {
              const resData = await getProviderDetails(token, formData?.from);
              if (resData && resData?.provider_number) {
                const resForm = {
                  provider_number:
                    resData?.provider_number[0] === "+"
                      ? resData?.provider_number
                      : `+${resData?.provider_number}`,
                  account_sid: resData?.account_sid,
                  twiml_app_sid: resData?.twiml_app_sid,
                  twilio_api_key: resData?.twilio_api_key,
                  twilio_api_secret: resData?.twilio_api_secret,
                  twilio_auth_token: resData?.account_token,
                };
                formData = { ...formData, ...resForm };

                const { data } = await axios.post(
                  "https://voice.crm-messaging.cloud/api/makeTextToSpeechCall",
                  formData
                );
                if (data && data?.success) {
                  // it means we have done call text so update history that it action finshed
                  if (workflowHistoryId) {
                    await WorkflowHistory.findByIdAndUpdate(
                      workflowHistoryId,
                      { status: "finshed" },
                      { new: true }
                    );
                  }
                } else {
                  if (workflowHistoryId) {
                    await WorkflowHistory.findByIdAndUpdate(
                      workflowHistoryId,
                      { status: "failed" },
                      { new: true }
                    );
                  }
                }
              } else {
                if (workflowHistoryId) {
                  await WorkflowHistory.findByIdAndUpdate(
                    workflowHistoryId,
                    { status: "failed" },
                    { new: true }
                  );
                }
              }
            } else {
              console.log("Token not found");
              if (workflowHistoryId) {
                await WorkflowHistory.findByIdAndUpdate(
                  workflowHistoryId,
                  { status: "failed" },
                  { new: true }
                );
              }
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
