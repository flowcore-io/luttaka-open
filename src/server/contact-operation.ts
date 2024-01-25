"use server";
import { auth } from "@clerk/nextjs";
import crypto from "crypto";

async function contactOperation(
  payload: object,
  operation: "create" | "update" | "delete",
): Promise<string> {
  const { userId } = auth();
  let contactid = "";
  let body = "";
  let eventtype = "";
  if (operation === "create") {
    // no contactid in the payload, need to generate one. eventtype is update
    contactid = crypto.randomUUID();
    body = JSON.stringify({
      contactid,
      userId,
      ...payload,
    });
    eventtype = "update";
  }
  if (operation === "update") {
    body = JSON.stringify({
      userId,
      ...payload,
    });
    eventtype = "update";
  }
  if (operation === "delete") {
    body = JSON.stringify({
      userId,
      ...payload,
    });
    eventtype = "delete";
  }
  try {
    const webhook = `${
      process.env.FLOWCORE_DATACORE ?? ""
    }/contact/${eventtype}?key=${process.env.FLOWCORE_KEY ?? ""}`;
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    return contactid;
  } catch (error) {
    // Handle any errors that occur during the API request
    console.error("Error occurred:", error);
    throw error;
  }
}

export { contactOperation };
