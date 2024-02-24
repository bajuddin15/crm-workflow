import axios from "axios";
import Workflow from "../models/workflow.model.js";
import WorkflowHistory from "../models/workflowHistory.model.js";
import { calculateTimeInMillis } from "../utils/common.js";

const incomingMessage = async (req, res) => {
  const { msgId, toNumber, fromNumber, message, mediaUrl, channel, email } =
    req.body;

  // take token from fromNumber - suppose we have this token
  const token = "OMs5rXuCphJxcYqSnmVP9RQAy";
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

    const formData = new FormData();
    formData.append("to", toNumber);
    formData.append("fromnum", fromNumber);
    formData.append("msg", message);
    formData.append("channel", channel);
    formData.append("mediaUrl", mediaUrl);

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

        if (action.unqName === "delay") {
          // delay if i have delay action
          // Define the delay in milliseconds (2 days = 2 * 24 * 60 * 60 * 1000 milliseconds)
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
        } else if (action.unqName === "sendSMS" && channel === "whatsapp") {
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
        } else if (action.unqName === "sendSMS" && channel === "whatsapp") {
          // yaha action.unqName whatsapp hoga
          // similar conditions for other action
        }
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
