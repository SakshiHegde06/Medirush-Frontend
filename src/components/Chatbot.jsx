import React, { useState, useRef, useEffect } from "react"
import { useLang } from "../context/LangContext"

const healthKeywords = [
  "fever","cold","cough","pain","headache","stomach","heart","blood","pressure","sugar",
  "diabetes","cancer","infection","virus","bacteria","medicine","tablet","doctor","hospital",
  "symptom","disease","treatment","surgery","vaccine","allergy","skin","rash","vomit","nausea",
  "diarrhea","constipation","breathing","chest","lungs","kidney","liver","bone","joint","muscle",
  "pregnancy","period","menstrual","mental","anxiety","depression","sleep","insomnia","diet",
  "nutrition","vitamin","protein","exercise","weight","obesity","thyroid","cholesterol","stroke",
  "asthma","dengue","malaria","typhoid","covid","flu","inflammation","swelling","wound","injury",
  "health","medical","clinical","diagnosis","prescription","dose","side effect","remedy","cure",
  "wat","what","how","why","when","is","are","can","should","does","do","my","i have","i feel",
  "বুক","পেট","মাথা","দাঁত","চোখ","কান","নাক","গলা",
]

function isHealthRelated(message) {
  const lower = message.toLowerCase()
  return healthKeywords.some(k => lower.includes(k))
}

const healthResponses = {
  fever: "Fever is usually a sign your body is fighting an infection. Stay hydrated, rest well, and take paracetamol if above 38°C. See a doctor if it persists more than 3 days.",
  headache: "Headaches can be caused by dehydration, stress, lack of sleep, or migraines. Drink water, rest in a dark room. If severe or persistent, consult a neurologist.",
  cough: "Cough can be viral or bacterial. Drink warm water with honey and ginger. If you have fever along with cough, see a doctor as it may indicate an infection.",
  cold: "Common cold usually resolves in 7-10 days. Rest, stay hydrated, and take steam inhalation. Vitamin C supplements can help boost immunity.",
  stomach: "Stomach pain can be due to gas, acidity, or infection. Avoid spicy food, drink ORS if diarrhea, and consult a gastroenterologist if pain is severe.",
  diabetes: "Diabetes requires regular monitoring of blood sugar levels. Maintain a balanced diet low in refined sugars, exercise regularly, and take prescribed medications.",
  blood: "Blood pressure should be regularly monitored. Normal range is 120/80 mmHg. High BP increases risk of stroke and heart disease. Reduce salt intake and exercise.",
  heart: "Heart health is crucial. Symptoms like chest pain, shortness of breath, or palpitations need immediate medical attention. Call 108 if experiencing severe chest pain.",
  skin: "Skin conditions like rashes, acne, or eczema should be evaluated by a dermatologist. Avoid scratching and keep the area clean and moisturized.",
  sleep: "Poor sleep affects overall health. Maintain a regular sleep schedule, avoid screens before bed, and limit caffeine after 4 PM. 7-8 hours is ideal for adults.",
  default: "That's a good health question! Based on general medical knowledge, I recommend consulting a qualified doctor for personalized advice. Would you like me to help you find a specialist on MediRush?"
}

function getHealthResponse(message) {
  const lower = message.toLowerCase()
  for (const [key, response] of Object.entries(healthResponses)) {
    if (key !== "default" && lower.includes(key)) return response
  }
  return healthResponses.default
}

export default function Chatbot() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "bot", text: t.chatWelcome }
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: userMsg }])
    setTyping(true)

    setTimeout(() => {
      let response
      if (!isHealthRelated(userMsg)) {
        response = t.onlyHealthQuestions
      } else {
        response = getHealthResponse(userMsg)
      }
      setMessages(prev => [...prev, { role: "bot", text: response }])
      setTyping(false)
    }, 1200)
  }

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(!open)} style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 500,
        width: 56, height: 56, borderRadius: "50%",
        background: "linear-gradient(135deg, var(--teal), var(--teal-dark))",
        border: "none", cursor: "pointer", fontSize: 24,
        boxShadow: "0 4px 20px rgba(0,201,167,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 500,
          width: 340, height: 460,
          background: "var(--navy-mid)", border: "1px solid rgba(0,201,167,0.3)",
          borderRadius: 16, display: "flex", flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          animation: "fadeInUp 0.3s ease forwards",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid var(--border)",
            background: "linear-gradient(135deg, rgba(0,201,167,0.15), rgba(0,201,167,0.05))",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 24 }}>🤖</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t.chatTitle}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--teal)" }}>● Online · Health questions only</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: msg.role === "user" ? "var(--teal)" : "rgba(255,255,255,0.07)",
                  color: msg.role === "user" ? "var(--navy)" : "var(--text-primary)",
                  fontSize: "0.83rem", lineHeight: 1.6,
                  fontWeight: msg.role === "user" ? 500 : 400,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", gap: 5, padding: "10px 14px", background: "rgba(255,255,255,0.07)", borderRadius: "14px 14px 14px 4px", width: "fit-content" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", animation: `pulse-teal 1s ease ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder={t.chatPlaceholder}
              style={{
                flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)",
                fontFamily: "inherit", fontSize: "0.83rem", outline: "none",
              }}
            />
            <button onClick={sendMessage} style={{
              background: "var(--teal)", border: "none", borderRadius: 8,
              width: 36, height: 36, cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--navy)", fontWeight: 700,
            }}>→</button>
          </div>
        </div>
      )}
    </>
  )
}
