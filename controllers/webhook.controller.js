import Workflow from "../models/workflow.model.js";
import WorkflowTrigger from "../models/workflowTrigger.model.js";
import { parseJsonToKeyValue, parseSingleData } from "../utils/common.js";

import axios from "axios";
import FormData from "form-data";
import WorkflowHistory from "../models/workflowHistory.model.js";
import { calculateTimeInMillis, replacePlaceholders } from "../utils/common.js";
import {
  executeApiAndGetResp,
  getProviderDetails,
  getTokenFromNumber,
} from "../utils/api.js";

// const requestData = { -------------------------all possible webhook data
//   method: req.method,
//   body: req.body,
//   params: req.params,
//   query: req.query,
// };
const allWebhook = async (req, res) => {
  const { triggerId, ...params } = req.params;

  const resp = { ...req.body, ...params, ...req.query };

  const trigger = await WorkflowTrigger.findById(triggerId);

  if (trigger) {
    if (trigger.responseListening || trigger.webhookResponse.length > 0) {
      // find workflowId
      const workflowId = trigger.workflowId;
      const workflow = await Workflow.findById(workflowId).populate([
        "triggers",
        "actions",
      ]);

      // check if workflow is published or not
      if (workflow.status === "draft") {
        return res.status(409).json({
          success: false,
          message: "Workflow is in draft mode, change to publish",
        });
      }

      // parse webhook data to save in database
      const parsedResp = parseJsonToKeyValue(resp);
      trigger.webhookResponse = parsedResp || trigger.webhookResponse;
      trigger.responseListening = false;

      workflow.webhookResponse = parsedResp || workflow.webhookResponse;

      await Promise.all([trigger.save(), workflow.save()]);

      // --------------------------all actions perform based on webhook response start
      // take token from fromNumber - suppose we have this token
      const webhook = resp;
      const {
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
      } = webhook;

      try {
        const token = workflow.token;
        const url = "https://app.crm-messaging.cloud/index.php/Api/sendMsg/";
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        };

        let workflowHistoryId;

        const triggers = workflow.triggers;
        let actions = workflow.actions;
        const reEnrollment = workflow.reEnrollment;
        const webhookRespData = workflow.webhookResponse;
        const webhookResp = webhookRespData.reduce((obj, item) => {
          obj[item.key] = item.value;
          return obj;
        }, {});
        console.log({ webhookResp });

        if (triggers?.length === 0) {
          return res
            .status(409)
            .json({ success: false, message: "You have not any trigger" });
        }

        // if reEnrollment off then update status skipped
        if (!reEnrollment) {
          console.log({ reEnrollment, status: "skipped" });
          const history = new WorkflowHistory({
            contact: fromNumber,
            status: "skipped",
            workflowId: workflow._id,
          });
          await history.save();
        } else {
          // reEnrollment on so don't skipped
          for (let j = 0; j < actions.length; j++) {
            let action = actions[j];

            const actionFormData = {
              fromNumber:
                (action?.toNumber === "{{fromNumber}}"
                  ? toNumber
                  : action?.fromNumber?.includes("{{webhook.")
                  ? replacePlaceholders(action?.fromNumber, {
                      webhook: webhookResp,
                    })
                  : action?.fromNumber) || toNumber,
              toNumber:
                (action?.toNumber === "{{toNumber}}"
                  ? fromNumber
                  : action?.toNumber?.includes("{{webhook.")
                  ? replacePlaceholders(action?.toNumber, {
                      webhook: webhookResp,
                    })
                  : action?.toNumber) || fromNumber,
              message:
                action?.message === "{{message}}"
                  ? message
                  : action?.message?.includes("{{webhook.")
                  ? replacePlaceholders(action?.message, {
                      webhook: webhookResp,
                    })
                  : action?.message,
              mediaUrl:
                (action?.mediaUrl === "{{mediaUrl}}"
                  ? mediaUrl
                  : action?.mediaUrl?.includes("{{webhook.")
                  ? replacePlaceholders(action?.mediaUrl, {
                      webhook: webhookResp,
                    })
                  : action?.mediaUrl) || "",
              email:
                action?.email === "{{contact.email}}"
                  ? email
                  : action?.email?.includes("{{webhook.")
                  ? replacePlaceholders(action?.email, {
                      webhook: webhookResp,
                    })
                  : action?.email,
              phoneNumber:
                action?.phoneNumber === "{{contact.phoneNumber}}"
                  ? phoneNumber || fromNumber
                  : action?.phoneNumber?.includes("{{webhook.")
                  ? replacePlaceholders(action?.phoneNumber, {
                      webhook: webhookResp,
                    })
                  : action?.phoneNumber,
              contactName:
                action?.contactName === "{{contact.name}}"
                  ? contactName
                  : action?.contactName?.includes("{{webhook.")
                  ? replacePlaceholders(action?.contactName, {
                      webhook: webhookResp,
                    })
                  : action?.contactName,
              groupName:
                action?.groupName === "{{contact.groupName}}"
                  ? groupName
                  : action?.groupName?.includes("{{webhook.")
                  ? replacePlaceholders(action?.groupName, {
                      webhook: webhookResp,
                    })
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
                  : action?.voiceText?.includes("{{webhook.")
                  ? replacePlaceholders(action?.voiceText, {
                      webhook: webhookResp,
                    })
                  : action?.voiceText,
            };

            // waiting history
            const history = new WorkflowHistory({
              contact: actionFormData?.toNumber,
              status: "waiting",
              actionId: action._id,
              workflowId: workflow._id,
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
            } else if (action.unqName === "sendSMS") {
              formData.append("to", actionFormData.toNumber);
              formData.append("fromnum", actionFormData.fromNumber);
              formData.append("msg", actionFormData.message);
              formData.append("channel", "sms");
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
              action.unqName === "sendWhatsAppTemplates" ||
              action.unqName === "sendWhatsAppNonTemplates"
            ) {
              // yaha action.unqName whatsapp hoga
              // similar conditions for other action
              formData.append("to", actionFormData.toNumber);
              formData.append("fromnum", actionFormData.fromNumber);
              formData.append("msg", actionFormData.message);
              formData.append("channel", "whatsapp");
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
                const { data } = await axios.post(url, formData, {
                  headers,
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
                      { status: "finished" },
                      { new: true }
                    );
                  }
                }
                console.log("add contact resp ----", {
                  data,
                  actionFormData,
                });
              } catch (error) {
                console.error("Error adding contact:", error);
                if (workflowHistoryId) {
                  await WorkflowHistory.findByIdAndUpdate(
                    workflowHistoryId,
                    { status: "failed" },
                    { new: true }
                  );
                }
                return res.status(500).json({
                  success: false,
                  message: "Failed to add contact.",
                });
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
            } else if (action.unqName === "filter") {
              // handle filter action
              const webhook = webhookResp;
              let filter_expression = action.filterExpression;
              console.log({ webhook, filter_expression });
              if (eval(filter_expression)) {
                // if expression give true
                console.log("expression matched.");
                if (workflowHistoryId) {
                  await WorkflowHistory.findByIdAndUpdate(
                    workflowHistoryId,
                    { status: "finshed" },
                    { new: true }
                  );
                }
              } else {
                // if expression give false then skipped
                if (workflowHistoryId) {
                  await WorkflowHistory.findByIdAndUpdate(
                    workflowHistoryId,
                    { status: "skipped" },
                    { new: true }
                  );
                }
                console.log(
                  "filtered actions success, expression not matched."
                );
                break;
              }
            } else if (action.unqName === "restApi") {
              /*
               // workflowId,
    // name,
    // unqName,
    actionEventMethod,
    endpointUrl,
    payloadType,
    // authType,
    headers,
    parameters,
              */
              const actionEventMethod = action.actionEventMethod;
              const endpointUrl = action.endpointUrl;
              const payloadType = action.payloadType;
              const headers = action.headers;
              const parameters = action.parameters;

              const formData = {
                actionEventMethod,
                endpointUrl,
                payloadType,
                headers,
                parameters,
                webhook: webhookResp,
                inputData: resp,
              };

              const apiResp = await executeApiAndGetResp(formData);

              if (apiResp) {
                const parsedRespInKeyValue = parseSingleData(apiResp);
                workflow.apiResponse = parsedRespInKeyValue;
                await workflow.save();

                await WorkflowHistory.findByIdAndUpdate(
                  workflowHistoryId,
                  { status: "finshed" },
                  { new: true }
                );
              } else {
                await WorkflowHistory.findByIdAndUpdate(
                  workflowHistoryId,
                  { status: "failed" },
                  { new: true }
                );
              }
            }
          }
        }

        return res.status(200).json({
          status: "success",
          message: "Response Accepted",
        });
      } catch (error) {
        console.error("Incoming controller error:", error);
        res.status(500).json({ success: false, message: error.message });
      }

      // ---------------------------all actions perform based on webhook response end
    } else {
      // Webhook not listening for response
      return res.status(409).json({
        success: false,
        message: "Webhook not listening for response",
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export { allWebhook };
