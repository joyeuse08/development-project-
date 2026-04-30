import { useState, useEffect } from "react"

const STATUS_CONFIG = {
    pending: { label: "Pending",color:"#f39c12", bg:"#f9e79f" },
    accepted: { label: "Accepted", color:"#27ae60", bg:"#abebc6" },
    rejected: { label: "Rejected", color:"#c0392b", bg:"#f5b7b1" }, 
};