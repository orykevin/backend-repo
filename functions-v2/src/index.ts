import * as functions from "firebase-functions";
import app from "../../core/app";

export const api = functions.https.onRequest(app);