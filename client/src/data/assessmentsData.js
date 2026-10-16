// ============================================================================
// TECHQUEST EOP ASSESSMENT DATA (PARALLEL FORM A & FORM B)
// Direct extraction from Thesis Appendix B & Deliverable 3 Assessment Package
// Grounded in N = 29 Malaysian Job Advertisements (OWNDAYS, Foundever, Concentrix, Evoxt, Teleperformance, MSIG, Accenture, BASF)
// ============================================================================

export const ASSESSMENTS_DATA = {
  pre_test: {
    id: 'section_0',
    type: 'Pre-test',
    form: 'Form A (Diagnostic Baseline Assessment)',
    title: 'Pre-Test: Diagnostic Spoken Assessment',
    description: 'Evaluates baseline oral communicative competence across four standardized workplace technical support and customer service tasks.',
    tasks: [
      {
        taskNumber: 1,
        title: 'Professional Call Opening & Credential Verification',
        workplaceContext: 'OWNDAYS Malaysia Customer Service Helpline',
        jobId: 'JA001',
        situation: 'An inbound caller rings the helpline regarding an online prescription glasses order.',
        customerPromptText: "Hello? Is this OWNDAYS Customer Care? I placed an order online three days ago, but I haven't received any tracking update yet.",
        targetCommunicationFunctions: [
          'Professional brand salutation and agent self-introduction',
          'Polite offer of help with tracking query',
          'Polite credential verification using polite modals (may, could)'
        ],
        prepTimeSeconds: 45,
        speakTimeSeconds: 35,
        kpiList: [
          'Brand name salutation (OWNDAYS Customer Care) + Agent name',
          'Polite offer of help ("I would be glad to check...")',
          'Modal credential request ("May I please verify your full name and order reference number?")'
        ],
        ticketDetails: {
          system: 'OWNDAYS Helpline Portal',
          ticketId: 'OD-8812',
          customer: 'Chew Wei Lun',
          category: 'Order Status Inquiry',
          priority: 'Normal'
        }
      },
      {
        taskNumber: 2,
        title: 'Diagnostic Fault Isolation & Reflective Paraphrasing',
        workplaceContext: 'Level-1 Technical Service Desk at Concentrix Malaysia',
        jobId: 'JA003',
        situation: 'A business client calls reporting that their mobile banking portal is freezing during vendor payment processing.',
        customerPromptText: "Hi, helpdesk! Your banking portal is completely useless! I tried logging in to process an urgent vendor payment, but the screen just freezes and won't let me in!",
        targetCommunicationFunctions: [
          'Calm, professional acknowledgment of caller frustration',
          'Two indirect diagnostic questions (error code & Wi-Fi vs mobile data)',
          'Reflective paraphrasing check to confirm understanding'
        ],
        prepTimeSeconds: 45,
        speakTimeSeconds: 45,
        kpiList: [
          'Empathetic validation without panic',
          'Indirect diagnostic questions ("Could you tell me if...", "Would you mind specifying whether...")',
          'Statement word order after indirect lead-ins',
          'Reflective paraphrasing check ("So if I understand correctly...")'
        ],
        ticketDetails: {
          system: 'Concentrix FinTech Enterprise Portal',
          ticketId: 'CNX-4901',
          customer: 'Lim Teck Seng (Financial Controller)',
          category: 'Portal Freeze / Login Failure',
          priority: 'High'
        }
      },
      {
        taskNumber: 3,
        title: 'Technical Workaround & Empathetic De-escalation',
        workplaceContext: 'Customer Complaint Operations at Teleperformance Malaysia',
        jobId: 'JA004',
        situation: 'An irate merchant calls because their payment checkout button is unresponsive, resulting in ongoing lost sales.',
        customerPromptText: "This is unacceptable! My customers are trying to pay on my online store, but the checkout button is completely dead! I am losing hundreds of dollars every hour and nobody is fixing it!",
        targetCommunicationFunctions: [
          'HEAR de-escalation framework (empathy, formal corporate apology, personal ownership)',
          'Plain English explanation of root cause (browser cache/cookie collision)',
          'First Conditional technical workaround with collaborative verification'
        ],
        prepTimeSeconds: 60,
        speakTimeSeconds: 60,
        kpiList: [
          'HEAR Framework application (Validation + Formal Apology on behalf of Teleperformance)',
          'Personal ownership ("Rest assured that I am taking personal ownership...")',
          'Plain English cause + First Conditional workaround ("If you clear your browser cookies...")',
          'Collaborative verification request ("Please try clearing your cookies now, and I will stay on the line...")'
        ],
        ticketDetails: {
          system: 'Teleperformance Payment Gateway',
          ticketId: 'TP-2048',
          customer: 'Marcus Henderson (E-commerce Merchant)',
          category: 'Checkout Button Freeze',
          priority: 'Urgent'
        }
      },
      {
        taskNumber: 4,
        title: 'CRM Ticket Synthesis & Oral Shift Handover',
        workplaceContext: 'Global Shift Handover Meeting at Accenture Malaysia',
        jobId: 'JA013',
        situation: 'You are completing your shift and must deliver a structured 90-second oral case summary to the incoming shift lead.',
        crmTicketRecord: {
          ticketId: '#TK-9021',
          account: 'Accenture Order-to-Cash (OTC) Regional Portal',
          priority: 'P1 Critical (Regional Impact: Thailand Desk)',
          symptom: "Automated payment reconciliation module freeze during batch processing; Error Code '504 Timeout'.",
          rootCause: 'Database table lock congestion following overnight patch update.',
          actionsCompleted: 'Tier-1 executed session reset, flushed DNS cache, and isolated blocked tables. Activated temporary manual batch workaround.',
          currentStatus: 'P1 Escalated Status with Senior Database Engineering Pod.',
          nextStep: 'Incoming lead must verify database table re-indexing with Tier-2 at 09:30 AM and update client prior to 10:00 AM SLA breach deadline.'
        },
        customerPromptText: "This is Shift Lead Sarah. I am ready for your P1 case handover briefing for Ticket TK-9021. Please proceed.",
        targetCommunicationFunctions: [
          '5-Stage Handover Framework (Identification -> Symptom -> Actions -> Current Status -> Next Step/SLA)',
          'Professional handover discourse markers and accurate SLA countdown'
        ],
        prepTimeSeconds: 90,
        speakTimeSeconds: 90,
        kpiList: [
          'Complete coverage of all 5 stages in 75–90 seconds',
          'Ticket-to-speech transition markers ("I am briefing you on...", "Initial diagnostic checks confirmed...")',
          'Accurate inclusion of SLA deadline (10:00 AM) and ticket ID (#TK-9021)'
        ]
      }
    ]
  },

  post_test: {
    id: 'section_9',
    type: 'Post-test',
    form: 'Form B (Post-Intervention Summative Assessment)',
    title: 'Post-Test: Outcome Spoken Assessment',
    description: 'Evaluates post-intervention oral communicative competence, task mastery, and occupational readiness across four parallel workplace tasks.',
    tasks: [
      {
        taskNumber: 1,
        title: 'Professional Call Opening & Credential Verification',
        workplaceContext: 'Foundever Malaysia Customer Care Desk',
        jobId: 'JA006',
        situation: 'An inbound caller rings regarding an unexpected billing fee on their monthly subscription statement.',
        customerPromptText: "Hello? Is this Foundever Customer Care? I'm calling because I see an extra subscription charge on my monthly bill that I didn't authorize.",
        targetCommunicationFunctions: [
          'Professional brand salutation and agent self-introduction',
          'Polite readiness to investigate subscription charge',
          'Polite credential verification using polite modals (full name and invoice reference number)'
        ],
        prepTimeSeconds: 45,
        speakTimeSeconds: 35,
        kpiList: [
          'Brand name salutation (Foundever Customer Care) + Agent name',
          'Polite offer of help ("I would be glad to help you investigate that charge today...")',
          'Modal credential request ("May I please verify your full name and invoice reference number?")'
        ],
        ticketDetails: {
          system: 'Foundever Billing Portal',
          ticketId: 'FDV-3108',
          customer: 'David Tan',
          category: 'Unauthorized Subscription Charge',
          priority: 'Normal'
        }
      },
      {
        taskNumber: 2,
        title: 'Diagnostic Fault Isolation & Reflective Paraphrasing',
        workplaceContext: 'Technical Service Desk at Evoxt Cloud Solutions',
        jobId: 'JA014',
        situation: 'An enterprise user calls reporting that their cloud control panel is unresponsive and times out.',
        customerPromptText: "Hi, helpdesk! I'm trying to launch my cloud management panel, but the page just sits there loading forever and eventually says 'Connection Lost'!",
        targetCommunicationFunctions: [
          'Calm, professional acknowledgment of caller concern',
          'Two indirect diagnostic questions (error code & office VPN connection)',
          'Reflective paraphrasing check to confirm understanding'
        ],
        prepTimeSeconds: 45,
        speakTimeSeconds: 45,
        kpiList: [
          'Empathetic validation without panic',
          'Indirect diagnostic questions ("Could you tell me if a numeric error code appears...", "Would you mind specifying whether you are connected through the office VPN?")',
          'Statement word order after indirect lead-ins',
          'Reflective paraphrasing check ("So if I understand correctly...")'
        ],
        ticketDetails: {
          system: 'Evoxt Cloud VM Console',
          ticketId: 'EVX-7740',
          customer: 'Arun Patel (Systems Admin)',
          category: 'Control Panel Connection Timeout',
          priority: 'High'
        }
      },
      {
        taskNumber: 3,
        title: 'Technical Workaround & Empathetic De-escalation',
        workplaceContext: 'Client Services Desk at MSIG Insurance',
        jobId: 'JA005',
        situation: 'A corporate client calls furious because an emergency travel insurance claim was delayed by five days during an overseas hospitalization.',
        customerPromptText: "This is completely unacceptable! My employee was hospitalized in Bangkok and we submitted an emergency claim five days ago! Nobody responded and we are stranded!",
        targetCommunicationFunctions: [
          'HEAR de-escalation framework (empathetic validation + formal corporate apology on behalf of MSIG + personal ownership)',
          'First Conditional procedural workaround ("If we submit an emergency priority override...")',
          'Commitment to direct status update within 30 minutes'
        ],
        prepTimeSeconds: 60,
        speakTimeSeconds: 60,
        kpiList: [
          'HEAR Framework application (Validation + Formal Apology on behalf of MSIG Insurance)',
          'Personal ownership ("Rest assured that I am taking personal charge of your file right now...")',
          'Procedural First Conditional workaround ("If we submit an emergency priority override right now, our senior claims manager will process...")',
          'Collaborative verification & 30-minute callback commitment'
        ],
        ticketDetails: {
          system: 'MSIG Global Claims Portal',
          ticketId: 'MSIG-9042',
          customer: 'Catherine Wong (Corporate HR Director)',
          category: 'Emergency Claim 5-Day Delay',
          priority: 'Urgent'
        }
      },
      {
        taskNumber: 4,
        title: 'CRM Ticket Synthesis & Oral Shift Handover',
        workplaceContext: 'Global Shift Handover Meeting at BASF (Malaysia) Sdn. Bhd.',
        jobId: 'JA010',
        situation: 'You are completing your shift and must deliver a structured 90-second oral case summary to the incoming European desk lead.',
        crmTicketRecord: {
          ticketId: '#TK-1009',
          account: 'BASF Order-to-Cash (OTC) SAP Platform (Thailand & Malaysia Desks)',
          priority: 'P1 Critical (Regional Impact: Batch Invoice Generation Crash)',
          symptom: "Total system crash within automated SAP billing reconciliation module; Error Code 'SAP-RAM-OVERFLOW'.",
          rootCause: 'Overnight database migration reduced server memory allocation caps.',
          actionsCompleted: 'Tier-1 isolated memory glitch, activated temporary manual processing workaround for urgent invoices, and escalated core bug directly to Tier-3 SAP Infrastructure Engineers.',
          currentStatus: 'P1 Escalated Status with Tier-3 Engineering Pod.',
          nextStep: 'Incoming desk lead must join joint technical sync call with Tier-3 at 06:00 PM and confirm full SAP module reboot before 07:00 PM SLA breach deadline.'
        },
        customerPromptText: "Good evening. European desk lead Julian here. I am ready for your P1 handover briefing for BASF Ticket TK-1009. Please go ahead.",
        targetCommunicationFunctions: [
          '5-Stage Handover Framework (Identification -> Symptom -> Actions -> Current Status -> Next Step/SLA)',
          'Professional handover discourse markers and accurate SLA countdown'
        ],
        prepTimeSeconds: 90,
        speakTimeSeconds: 90,
        kpiList: [
          'Complete coverage of all 5 stages in 75–90 seconds',
          'Ticket-to-speech transition markers ("I am briefing you on...", "sitting at P1 status", "The required next steps...")',
          'Accurate inclusion of SLA deadline (07:00 PM) and ticket ID (#TK-1009)'
        ]
      }
    ]
  }
};

// ============================================================================
// 25-POINT SPEAKING ASSESSMENT RUBRIC (Pre-test and Post-test)
// Updated from Speaking Assessment Rubric (Pre-test and Post-test).docx
// ============================================================================
export const RUBRIC_CRITERIA_25 = [
  {
    id: 'task_achievement',
    label: '1. Task Achievement',
    shortLabel: 'Task Achievement',
    description: 'Fully addresses the issue; completes all required task instructions.',
    bands: {
      5: 'Fully addresses the issue; completes all required task instructions.',
      4: 'Addresses main issue; minor omissions in task instructions.',
      3: 'Addresses main issue; misses some key details or required steps.',
      2: 'Partially addresses the issue; misses several required steps.',
      1: 'Fails to address the issue; incomplete or irrelevant response.'
    }
  },
  {
    id: 'interactive_comm',
    label: '2. Professional & Pragmatic Appropriateness',
    shortLabel: 'Professional & Pragmatic Appropriateness',
    description: 'Consistently polite, professional, and empathetic throughout the call.',
    bands: {
      5: 'Consistently polite, professional, and empathetic throughout the call.',
      4: 'Maintains a polite, professional tone with minor lapses in empathy.',
      3: 'Uses basic polite expressions; tone is generally acceptable but lacks warmth.',
      2: 'Minimally polite; sounds robotic, blunt, or overly casual.',
      1: 'Insensitive, dismissive, or inappropriate tone.'
    }
  },
  {
    id: 'vocabulary',
    label: '3. Occupational Vocabulary',
    shortLabel: 'Occupational Vocabulary',
    description: 'Accurate, varied, and natural technical support and customer service vocabulary.',
    bands: {
      5: 'Accurate, varied, and natural technical support and customer service vocabulary.',
      4: 'Appropriate occupational vocabulary; minor errors or light repetition.',
      3: 'Sufficient basic vocabulary; occasional inaccurate or repetitive words.',
      2: 'Limited vocabulary; frequent inappropriate word choices causing confusion.',
      1: 'Very limited or largely incorrect vocabulary; unclear response.'
    }
  },
  {
    id: 'grammar',
    label: '4. Grammatical Accuracy',
    shortLabel: 'Grammatical Accuracy',
    description: 'Accurate and appropriate grammatical structures; control of sentence patterns.',
    bands: {
      5: 'Accurate and appropriate grammatical structures; negligible errors.',
      4: 'Mostly accurate structures; minor errors do not affect meaning.',
      3: 'Generally understandable; noticeable errors affecting clarity.',
      2: 'Frequent grammatical errors interfering with meaning.',
      1: 'Persistent grammatical errors; response very difficult to follow.'
    }
  },
  {
    id: 'pronunciation_fluency',
    label: '5. Pronunciation and Fluency',
    shortLabel: 'Pronunciation and Fluency',
    description: 'Clear, smooth delivery; natural pacing; minimal hesitation; consistent clarity.',
    bands: {
      5: 'Clear, smooth delivery; natural pacing; minimal hesitation; consistent clarity.',
      4: 'Clear speech; generally smooth delivery; occasional brief hesitation.',
      3: 'Understandable delivery; noticeable hesitation, uneven pacing, or minor errors.',
      2: 'Frequent hesitation: disrupted pacing; pronunciation affects understanding.',
      1: 'Speech difficult to follow; severe pronunciation problems; prolonged hesitation.'
    }
  }
];

// ============================================================================
// PERFORMANCE LEVEL MAPPING (Score Range 1–25)
// Direct extraction from Speaking Assessment Rubric (Pre-test and Post-test).docx
// ============================================================================
export const PERFORMANCE_LEVELS_25 = [
  {
    level: 'Excellent',
    scoreRange: '21-25',
    minScore: 21,
    maxScore: 25,
    description: 'Does a fantastic job in every area, speaking smoothly and clearly with almost no mistakes.',
    cefr: 'B2.2 / C1',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badgeColor: 'emerald'
  },
  {
    level: 'Very Good',
    scoreRange: '16-20',
    minScore: 16,
    maxScore: 20,
    description: 'Shows strong skills overall, making only small mistakes that do not disrupt communication.',
    cefr: 'B2.1',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    badgeColor: 'blue'
  },
  {
    level: 'Good',
    scoreRange: '11-15',
    minScore: 11,
    maxScore: 15,
    description: 'Meets the basic requirements and gets the main job done, though noticeable mistakes still happen.',
    cefr: 'B1.2',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    badgeColor: 'indigo'
  },
  {
    level: 'Fair',
    scoreRange: '6-10',
    minScore: 6,
    maxScore: 10,
    description: 'Only gets part of the job done; frequent mistakes make communication tricky.',
    cefr: 'B1.1',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    badgeColor: 'amber'
  },
  {
    level: 'Poor',
    scoreRange: '1-5',
    minScore: 1,
    maxScore: 5,
    description: 'Struggles across the board and fails to meet basic standards.',
    cefr: 'A2',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    badgeColor: 'rose'
  }
];

// Resolves rating details given raw score (out of 25)
export function getCefrRating(totalRawScore, maxScore = 25) {
  const score = Math.round(Number(totalRawScore) || 0);

  if (score >= 21) {
    return {
      level: 'Excellent',
      label: 'Excellent',
      scoreRange: '21-25',
      description: 'Does a fantastic job in every area, speaking smoothly and clearly with almost no mistakes.',
      cefr: 'B2.2 / C1',
      badgeColor: 'emerald',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  } else if (score >= 16) {
    return {
      level: 'Very Good',
      label: 'Very Good',
      scoreRange: '16-20',
      description: 'Shows strong skills overall, making only small mistakes that do not disrupt communication.',
      cefr: 'B2.1',
      badgeColor: 'blue',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300'
    };
  } else if (score >= 11) {
    return {
      level: 'Good',
      label: 'Good',
      scoreRange: '11-15',
      description: 'Meets the basic requirements and gets the main job done, though noticeable mistakes still happen.',
      cefr: 'B1.2',
      badgeColor: 'indigo',
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    };
  } else if (score >= 6) {
    return {
      level: 'Fair',
      label: 'Fair',
      scoreRange: '6-10',
      description: 'Only gets part of the job done; frequent mistakes make communication tricky.',
      cefr: 'B1.1',
      badgeColor: 'amber',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  } else {
    return {
      level: 'Poor',
      label: 'Poor',
      scoreRange: '1-5',
      description: 'Struggles across the board and fails to meet basic standards.',
      cefr: 'A2',
      badgeColor: 'rose',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300'
    };
  }
}
