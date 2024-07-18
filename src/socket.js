"use client";
import { APP_URL } from "./utils/secrets";
import { io } from "socket.io-client";

export const socket = io(APP_URL);