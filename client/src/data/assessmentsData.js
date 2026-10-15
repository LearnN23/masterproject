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
// 25-POINT BLUEPRINT ANALYTIC RUBRIC (EOP Blueprint Section 5.1 & Appendix B)
// ============================================================================
export const RUBRIC_CRITERIA_25 = [
  {
    id: 'task_achievement',
    label: '1. Task Achievement / Fulfillment',
    description: 'Effectively completes all workplace requirements, communicates technical facts, error codes, and SLA details completely.',
    bands: {
      5: 'Completely fulfills all task requirements. All essential information points and technical details provided accurately.',
      4: 'Fulfills all main task requirements with clear, relevant details; minor non-critical omissions.',
      3: 'Fulfills primary task but lacks completeness in 1 detail or elaboration; omits secondary diagnostic or SLA details.',
      2: 'Partially fulfills task; omits key customer information or resolution steps; confuses symptoms or ticket details.',
      1: 'Fails to fulfill task. Response is irrelevant, off-topic, or unperformed.'
    }
  },
  {
    id: 'interactive_comm',
    label: '2. Interactive Communication & Pragmatic Tone',
    description: 'Professional customer-service register, empathetic validation, HEAR framework de-escalation, active case ownership.',
    bands: {
      5: 'Tone is highly professional, empathetic, and customer-centered. Perfect register throughout with genuine case ownership.',
      4: 'Tone is polite, respectful, and appropriate. Minor slips in register do not affect rapport.',
      3: 'Tone is acceptable but somewhat rigid or mechanical. Basic politeness markers present; lacks depth in empathy.',
      2: 'Tone is inappropriate, overly abrupt, or defensive. Tells customer to "calm down" or blames colleagues.',
      1: 'Response is rude, hostile, or completely inappropriate for customer service.'
    }
  },
  {
    id: 'vocabulary',
    label: '3. Occupational & Technical Vocabulary',
    description: 'Use of domain-specific IT support terms, customer service expressions, acronyms (SLA, FCR, P1), and plain English explanations.',
    bands: {
      5: 'Uses precise, domain-appropriate technical terms, CS acronyms, and workplace expressions effortlessly.',
      4: 'Uses accurate CS and technical vocabulary with minimal awkward phrasing.',
      3: 'Uses adequate general vocabulary; limited range of domain terms or CS acronyms.',
      2: 'Uses repetitive or incorrect terms; relies on generic words or L1 Thai structures.',
      1: 'Vocabulary is inadequate; frequent incorrect word choices render message unclear.'
    }
  },
  {
    id: 'grammar',
    label: '4. Grammatical Control & Target Structures',
    description: 'Polite modal verbs (may/could), indirect question word order, First Conditional workarounds, and passive reporting verbs.',
    bands: {
      5: 'Flawless control of target patterns (modals, indirect questions, conditionals). Zero major grammatical errors.',
      4: 'Good grammatical control with minor errors that do not impair meaning or cause misunderstanding.',
      3: 'Grammatical errors occur (inconsistent indirect word order or conditional verb forms) but core workplace message remains understandable.',
      2: 'Frequent grammatical errors severely distort meaning or create confusion (missing verbs, broken tenses).',
      1: 'Severe grammatical breakdown; no recognizable sentence control.'
    }
  },
  {
    id: 'pronunciation_fluency',
    label: '5. Pronunciation, Fluency & Intelligibility',
    description: 'Pacing (100–120 wpm), smooth flow, minimal unnatural pauses. Non-penalization of intelligible Thai accent under CEFR B2.',
    bands: {
      5: 'Speech is natural, fluent, and easy to understand (100–120 wpm). Natural intonation. Thai accent is fully intelligible.',
      4: 'Clear speech with minor hesitations that do not impede comprehension. Easy to understand throughout.',
      3: 'Noticeable hesitations, self-corrections, or choppy pacing. Comprehensible with minor listener effort.',
      2: 'Frequent, prolonged pauses and disfluencies. Heavy mispronunciations force significant listener effort.',
      1: 'Unintelligible speech or prolonged silence. Communication breaks down completely.'
    }
  }
];

// CEFR Level Mapping (Appendix B Section 4.3)
export function getCefrRating(totalRawScore, maxScore = 25) {
  const percentage = (totalRawScore / maxScore) * 100;
  if (percentage >= 90) {
    return {
      cefr: 'B2.2 / C1',
      label: 'Advanced / Job-Ready Specialist',
      recommendation: 'Direct BPO Deployment',
      badgeColor: 'emerald'
    };
  } else if (percentage >= 75) {
    return {
      cefr: 'B2.1',
      label: 'Proficient / Deployable Support Agent',
      recommendation: 'Deployable under Mentor Supervision',
      badgeColor: 'blue'
    };
  } else if (percentage >= 60) {
    return {
      cefr: 'B1.2',
      label: 'Intermediate Support Agent',
      recommendation: 'Requires On-the-Job Supervision',
      badgeColor: 'amber'
    };
  } else if (percentage >= 40) {
    return {
      cefr: 'B1.1',
      label: 'Developing Support Agent',
      recommendation: 'Requires Remedial Language Training',
      badgeColor: 'orange'
    };
  } else {
    return {
      cefr: 'A2',
      label: 'Novice Support Agent',
      recommendation: 'Unprepared for Frontline Voice Operations',
      badgeColor: 'red'
    };
  }
}
