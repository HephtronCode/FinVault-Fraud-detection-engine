# Product Requirements Document: FinVault V1

|                  |                                                     |
| :--------------- | :-------------------------------------------------- |
| **Product Name** | FinVault - AI-Powered Transaction Monitoring System |
| **Author**       | Babatunde Yahaya                                    |
| **Status**       | V1 Complete                                         |
| **Version**      | 1.0                                                 |

---

### 1. Overview

FinVault is an advanced AI-ready automation system designed to provide real-time transaction monitoring, intelligent fraud detection, and a preliminary Anti-Money Laundering (AML) analysis and case management tool for digital banking institutions. The system's primary goal is to shift the fraud detection process from a slow, reactive, manual review into a proactive, automated, and context-rich decision-making workflow.

### 2. The Problem

Fraud and financial crime are evolving faster than traditional banking systems can keep up. Fraud analysis teams are inundated with a high volume of low-quality alerts (false positives), forcing them to spend the majority of their time on manual, repetitive data gathering—"swivel-chair" analysis across multiple disconnected systems. This crucial time lost delays the identification of genuine threats, increases the risk of financial loss, and creates a high-pressure, inefficient work environment.

### 3. Objectives & Key Results (OKRs)

- **Objective 1: Accelerate Threat Detection.**
  - **KR1:** Reduce the time-to-detection for high-risk transactions from hours to under 5 seconds.
  - **KR2:** Automate the data enrichment process for 100% of incoming transactions.
- **Objective 2: Improve Analyst Efficiency.**
  - **KR1:** Decrease the time an analyst spends on preliminary data gathering for each case by 90%.
  - **KR2:** Create a centralized "single source of truth" dashboard for all case investigations.
- **Objective 3: Enhance Alert Intelligence.**
  - **KR1:** Reduce false positive alerts forwarded for manual review by at least 40% by implementing a multi-factor risk-scoring algorithm.

### 4. User Persona

- **Name:** David
- **Role:** Fraud Analyst at a mid-sized digital bank.
- **Goals:**
  - Quickly identify and stop fraudulent transactions to save the bank money.
  - Efficiently manage a high-volume queue of alerts.
  - Spend more time on complex, interesting investigation patterns.
- **Frustrations:**
  - "I feel like a human data-entry machine, not an investigator."
  - "By the time I've gathered all the info, the money is often already gone."
  - "I'm constantly switching between 4 different browser tabs for every single case."

### 5. Features & Functionality (User Stories)

- **F1: Real-Time Ingestion:** As a system, I must provide a secure webhook capable of receiving real-time JSON transaction data from any payment gateway.
- **F2: Automated Enrichment:** As an analyst (David), I want every incoming transaction to be automatically enriched with the customer's historical profile, so I have immediate context without manual lookups.
- **F3: Risk Scoring:** As a system, I must apply a multi-factor risk algorithm to every transaction to identify anomalies in value, location, and frequency.
- **F4: Automated Case Creation & Alerting:** As an analyst (David), when a high-risk transaction is detected, I want a case to be automatically created in the system and to receive an instant alert in Slack, so I can act immediately.
- **F5: Secure Dashboard:** As an analyst (David), I need to log in to a secure dashboard to view the queue of new cases.
- **F6: Interactive Investigation:** As an analyst (David), I want to click on a case and see all its details in a clean, intuitive view, so I can make an informed decision.
- **F7: Case Resolution:** As an analyst (David), I need buttons to update the status of a case (`Under Investigation`, `Closed - Legitimate`, `Closed - Fraud`) so I can manage my workflow and resolve alerts.

### 6. Technical Architecture Overview

The system is architected as a composable, event-driven platform. **n8n** serves as the central orchestration engine, triggering on real-time webhooks. **Supabase (PostgreSQL)** acts as the primary data warehouse for historical data, while **Airtable** serves as a flexible backend for the case management system. The user interface is a decoupled **React** single-page application, communicating with the backends via their respective APIs and protected by **Supabase Auth**.

### 7. Success Metrics & KPIs

- **Time-to-Detection (TTD):** Time from transaction to high-risk alert creation.
- **Time-to-Resolution (TTR):** Average time from case creation to final resolution.
- **False Positive Rate (FPR):** Percentage of high-risk alerts that are ultimately resolved as "Legitimate."
- **Analyst Time Saved:** Estimated hours per week no longer spent on manual data gathering.

### 8. Out of Scope for V1 (Future Considerations)

- **Role-Based Access Control (RBAC):** A distinction between "Analyst" and "Manager" roles in the dashboard.
- **Full Audit Trail:** A dedicated, immutable log of all actions taken on a case for compliance purposes.
- **Advanced Analytics:** Dashboards for visualizing fraud trends over time.
- **Machine Learning Integration:** Replacing the rules-based scoring engine with a predictive ML model.
