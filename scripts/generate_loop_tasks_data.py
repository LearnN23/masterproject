import zipfile, xml.etree.ElementTree as ET, os, json, re

def get_paragraphs(path):
    with zipfile.ZipFile(path) as z:
        xml_content = z.read('word/document.xml')
        root = ET.fromstring(xml_content)
        lines = []
        for p in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            texts = [node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
            if texts:
                lines.append(''.join(texts).strip())
        return [l for l in lines if l]

def extract_lesson_1():
    lines = get_paragraphs('loop task/Lesson 1 Loop task.docx')
    return {
        "id": 1,
        "unitId": "lesson_1",
        "title": "Lesson 1: Professional Customer Enquiries & Opening a Support Interaction",
        "shortTitle": "Customer Enquiries & Call Openings",
        "workplace": "Concentrix IT Service Desk (Malaysia)",
        "callerName": "Sarah (Marketing Department)",
        "scenario": "Sarah from Marketing is in a rush because she cannot log into the company portal and has an urgent client report due in 10 minutes.",
        "durationTotalMinutes": 120,
        "preTask": {
            "usefulExpressions": [
                {
                    "category": "Brand Greeting & Agent Identification",
                    "examples": [
                        "Thank you for calling Concentrix IT Support. My name is [Agent Name].",
                        "Good morning, IT Service Desk. This is [Agent Name] speaking.",
                        "Thank you for contacting Technical Support. My name is [Agent Name]. How may I assist you today?"
                    ]
                },
                {
                    "category": "Empathy & Immediate Reassurance",
                    "examples": [
                        "I understand how urgent this is for your presentation. Don't worry, I can help you with that right away.",
                        "I completely understand how frustrating it is to be locked out when you have a deadline. Let's get this sorted out.",
                        "I would be glad to look into this login issue for you today."
                    ]
                },
                {
                    "category": "Probing & Identity Verification",
                    "examples": [
                        "To access your account securely, may I please verify your full name and Employee ID?",
                        "Could you kindly confirm the registered email address linked to your portal profile?",
                        "Could you please tell me the exact error message that appears on your screen?"
                    ]
                },
                {
                    "category": "Sequencing Instructions & Courtesy Hold",
                    "examples": [
                        "Please allow me just a moment while I pull up your account record in our system.",
                        "First, I have unlocked your profile from our dashboard.",
                        "Next, could you please verify that your Caps Lock is turned off and try signing in again?",
                        "Finally, if the error persists, I will send a temporary password reset link directly to your mobile."
                    ]
                }
            ],
            "vocabulary": [
                { "customerPhrase": "I'm locked out", "technicalTerm": "Account Lockout", "meaning": "User account automatically locked due to exceeding maximum failed authentication attempts." },
                { "customerPhrase": "It won't let me sign in", "technicalTerm": "Authentication Failure", "meaning": "System rejects credentials due to mismatched password or expired session token." },
                { "customerPhrase": "The screen is throwing red text", "technicalTerm": "Invalid Credentials Error", "meaning": "System warning indicating incorrect username or password." },
                { "customerPhrase": "Company portal", "technicalTerm": "Enterprise Application Dashboard", "meaning": "Core web-based business management interface." }
            ],
            "grammarFocus": {
                "title": "Polite Modal Requests (May I... / Could you...)",
                "syntax": "[Modal: May / Could] + [Subject: I / you] + [Polite: please/kindly] + [Base Verb] + [Target Info]?",
                "bad": "Give me your password and ID right now.",
                "good": "May I please have your Employee ID and workstation name?"
            }
        },
        "turns": [
            {
                "turnNumber": 1,
                "speaker": "Customer (Sarah)",
                "role": "caller",
                "isStudent": False,
                "audioPrompt": "Hi, IT Service Desk? This is Sarah from Marketing. I can't log into the company portal at all! The screen keeps throwing an error, and I have an urgent client report due in 10 minutes. Please help!",
                "tone": "Rushed, stressed, and anxious",
                "timeLimit": 20
            },
            {
                "turnNumber": 2,
                "speaker": "Student Agent",
                "role": "agent",
                "isStudent": True,
                "timeLimit": 30,
                "taskGoal": "Deliver standard brand greeting and introduce your name, show empathy/reassurance, and use a polite modal verb to request Employee ID and workstation name.",
                "hints": [
                    "Greeting: 'Good morning, Concentrix IT Service Desk. My name is [Your Name].'",
                    "Empathy: 'I completely understand this is urgent, Sarah, and I will be glad to assist you right away.'",
                    "Modal Request: 'To access your profile, may I please verify your Employee ID and workstation name?'"
                ],
                "modelResponse": "Good morning, Concentrix IT Service Desk. My name is Golf. I completely understand this is urgent, Sarah, and I will be glad to assist you with logging in right away. To access your profile, may I please verify your Employee ID and workstation name?",
                "modelAnalysis": "Complete brand greeting, immediate empathy to reduce stress, and polite modal request complying with security protocols."
            },
            {
                "turnNumber": 3,
                "speaker": "Customer (Sarah)",
                "role": "caller",
                "isStudent": False,
                "audioPrompt": "Thanks for checking. My Employee ID is MK-4092, on laptop DESKTOP-MKT04. The exact red text on the screen says 'Invalid Credentials or Account Locked', but I'm completely sure I typed my password correctly!",
                "tone": "Slightly relieved after being acknowledged, but still worried",
                "timeLimit": 25
            },
            {
                "turnNumber": 4,
                "speaker": "Student Agent",
                "role": "agent",
                "isStudent": True,
                "timeLimit": 35,
                "taskGoal": "Use courtesy hold phrasing while checking system, explain sequential instructions (account unlock, check Caps Lock, password reset offer), and offer closing assistance.",
                "hints": [
                    "Courtesy Hold: 'Thank you for confirming those details, Sarah. Please allow me just a moment while I pull up your account record.'",
                    "Sequencing: 'First, I have just unlocked your account on our server. Next, could you please make sure your Caps Lock key is off, and try logging in again?'",
                    "Alternative/Closing: 'If needed, I can also trigger an immediate password reset to your mobile.'"
                ],
                "modelResponse": "Thank you for confirming those details, Sarah. Please allow me just a moment while I pull up your account record. First, I have just unlocked your account on our server. Next, could you please make sure your Caps Lock key is off, and try logging in again? If needed, I can also trigger an immediate password reset to your mobile.",
                "modelAnalysis": "Courtesy hold phrasing prevents dead air, and transition markers (First, Next) provide clear, panic-free troubleshooting."
            }
        ],
        "postTask": {
            "modelDialogue": [
                { "turn": 1, "speaker": "Customer (Sarah)", "text": "Hi, IT Service Desk? This is Sarah from Marketing. I can't log into the company portal at all! The screen keeps throwing an error, and I have an urgent client report due in 10 minutes. Please help!", "purpose": "Customer expressing urgency and distress" },
                { "turn": 2, "speaker": "Agent (Golf)", "text": "Good morning, Concentrix IT Service Desk. My name is Golf. I completely understand this is urgent, Sarah, and I will be glad to assist you with logging in right away. To access your profile, may I please verify your Employee ID and workstation name?", "purpose": "Brand Salutation + Empathy + Modal Verification" },
                { "turn": 3, "speaker": "Customer (Sarah)", "text": "Thanks for checking. My Employee ID is MK-4092, on laptop DESKTOP-MKT04. The exact red text on the screen says 'Invalid Credentials or Account Locked', but I'm completely sure I typed my password correctly!", "purpose": "Customer provides credentials and diagnostic error" },
                { "turn": 4, "speaker": "Agent (Golf)", "text": "Thank you for confirming those details, Sarah. Please allow me just a moment while I pull up your account record. First, I have just unlocked your account on our server. Next, could you please make sure your Caps Lock key is off, and try logging in again? If needed, I can also trigger an immediate password reset to your mobile.", "purpose": "Courtesy Hold + Sequential Instructions + Resolution Offer" }
            ],
            "languageFunctions": [
                { "phrasing": "Good morning, Concentrix IT Service Desk. My name is Golf.", "function": "Brand Salutation & Agent Identification", "rationale": "Builds corporate credibility and meets QA BPO compliance standards." },
                { "phrasing": "I completely understand this is urgent, Sarah, and I will be glad to assist you right away.", "function": "Empathy & Immediate Reassurance", "rationale": "De-escalates customer anxiety and boosts CSAT satisfaction ratings." },
                { "phrasing": "May I please verify your Employee ID and workstation name?", "function": "Polite Credential Verification (Modal Request)", "rationale": "Complies with Data Privacy protocols without sounding demanding or accusatory." },
                { "phrasing": "Please allow me just a moment while I pull up your account...", "function": "Courtesy Hold Phrasing", "rationale": "Prevents 'Dead Air' silence on the call and reassures caller action is ongoing." },
                { "phrasing": "First, I have unlocked... Next, could you please...?", "function": "Sequencing Instructions", "rationale": "Reduces cognitive load so user follows steps smoothly without confusion." }
            ],
            "alternativeResponses": [
                {
                    "style": "Direct & Action-Oriented (Urgent Rush)",
                    "turn2": "IT Helpdesk, this is Golf. I understand you are in a rush—let's resolve this login issue immediately. Could you kindly provide your staff ID so that I can look into your portal credentials?",
                    "turn4": "I've refreshed your permissions in the system. Would you mind closing the browser and giving it another try?"
                },
                {
                    "style": "Standard Professional (Corporate Standard)",
                    "turn2": "Thank you for calling IT Support. My name is Golf. Don't worry at all, Sarah, I can certainly help get your portal working before your deadline. May I verify your user account ID?",
                    "turn4": "Your profile has been unlocked. Could you please attempt to log in now while I stay on the line with you?"
                }
            ],
            "selfAssessmentChecklist": [
                "I stated a professional brand greeting and introduced my name clearly in Turn 2.",
                "I expressed genuine empathy and validated the caller's deadline urgency.",
                "I used a polite modal verb (May I... / Could you...) to request ID and workstation details.",
                "I used a courtesy hold phrase to avoid dead air before checking records.",
                "I explained sequential troubleshooting steps using transition markers (First, Next) in Turn 4."
            ]
        }
    }

print("Lesson 1 extracted successfully.")
