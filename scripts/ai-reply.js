// scripts/ai-reply.js

const axios = require('axios');

async function aiReply(message) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "رد طبيعي على أسئلة العميل، وإذا طلب خدمة مباشرة أو دعم يتم تحويله للتصعيد."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.4
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiText = response.data.choices[0].message.content.trim();

    const escalate = aiText.includes("التواصل مع الدعم") || aiText.includes("اريد التحدث مع شخص");

    return { reply: aiText, escalate };
  } catch (error) {
    console.error('Error in ai-reply:', error);
    return { reply: "لم أستطع فهم طلبك، سيتم تحويلك إلى الدعم.", escalate: true };
  }
}

module.exports = aiReply;
