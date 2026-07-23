// Supabase Edge Function: send-playbook
// Receives lead capture, stores in DB, sends playbook via Resend

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = "re_GF7N534Q_JVWJjeuup1aDAEXZTgJRjdfd";
const FROM_EMAIL = "MAF Deploy <onboarding@resend.dev>";

const playbooks = {
  demand: {
    subject: "Your Demand Playbook — how to fix your lead flow",
    html: `...` // truncated for brevity — full HTML in repo
  },
  // ... other 5 playbooks
};

Deno.serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
      },
    });
  }

  try {
    const { name, email, constraint_id, scores } = await req.json();

    if (!name || !email || !constraint_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // 1. Store in Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: dbError } = await supabase
      .from("lead_captures")
      .insert({ name, email, constraint_id, scores });

    if (dbError) {
      console.error("Supabase insert failed:", dbError);
    }

    // 2. Send playbook via Resend
    const playbook = playbooks[constraint_id];
    if (playbook) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [email],
          subject: playbook.subject,
          html: playbook.html,
        }),
      });

      if (!resendRes.ok) {
        console.error("Resend failed:", await resendRes.text());
        return new Response(JSON.stringify({ error: "Failed to send email" }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Handler error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
