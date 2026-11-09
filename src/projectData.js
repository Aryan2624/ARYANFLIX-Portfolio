import {BrainCircuit, Shield, LineChart, Scan, Plane, Wallet} from 'lucide-react';

// Manually featured projects. The GitHub library fetches all public repositories
// independently and merges matching entries by their exact repo URLs.
// Links are displayed only when a real source URL exists.
export const projects = [
  {
    id: '01', title: 'CampusIQ', problem: 'Making scattered academic information useful without requiring people to interpret raw tables.', approach: 'Combine academic data preparation, interactive views, and machine-learning exploration into a campus insights workflow.', category: 'CAMPUS INTELLIGENCE',
    desc: 'A student-success and campus analytics platform that turns academic data into clearer insights.',
    overview: 'CampusIQ explores how student and campus data can be organized into one intelligent platform. Its purpose is to make academic trends easier to understand and help educators identify where attention or support may be needed. The project brings analytics, a web interface, APIs, and machine learning together.',
    features: [
      {title:'Student insights', text:'A unified view of academic data and patterns that may influence student success.'},
      {title:'Campus analytics', text:'Visual summaries that make trends and important indicators easier to interpret.'},
      {title:'ML exploration', text:'Using machine learning to investigate patterns and opportunities for actionable insights.'},
      {title:'Full-stack architecture', text:'React interface connected to a Python / FastAPI application layer.'}
    ],
    workflow:['Campus data','Data preparation','ML / analytics','Insight dashboard'],
    tags:['React','FastAPI','Python','Machine Learning'],
    status:'PORTFOLIO PROJECT', note:'Describes the project scope; specific deployment details have not been supplied.',
    repo:null, icon:BrainCircuit, color:'#d32749'
  },
  {
    id: '02', title: 'DeepShield AI', problem: 'Security signals arrive in different formats, making suspicious links, messages, and events difficult to review together.', approach: 'Explore feature extraction, threat classification, and a common API layer for cyber-risk analysis.', category: 'CYBERSECURITY / AI',
    desc: 'Cybersecurity intelligence for suspicious links, phishing threats, and network activity.',
    overview: 'DeepShield AI is an evolving cybersecurity analytics platform that combines threat-detection modules and risk interpretation in one interface. It focuses on identifying potentially harmful activity—from malicious URLs and phishing messages to suspicious network patterns—and presenting the findings in a practical way.',
    features: [
      {title:'Malicious URL detection', text:'Analyze URL-related signals to identify links that may carry security risks.'},
      {title:'Phishing analysis', text:'Explore detection of suspicious emails and messages with ML and language-based features.'},
      {title:'Network threat monitoring', text:'Investigate intrusion and anomaly patterns in network or security-event data.'},
      {title:'Risk & security analytics', text:'Bring threat indicators into a unified risk-oriented analysis workflow.'}
    ],
    workflow:['Threat input','Feature extraction','Detection models','Risk insights'],
    tags:['Python','Scikit-learn','FastAPI','Machine Learning','Security Analytics'],
    status:'IN DEVELOPMENT', note:'Modules are being developed; the overview does not claim production deployment.',
    repo:'https://github.com/Aryan2624/DeepShield-AI', icon:Shield, color:'#aa2444'
  },
  {
    id: '03', title: 'StockVision AI', problem: 'Stock-price patterns are complex and difficult to interpret from raw historical data alone.', approach: 'Prepare market series, calculate trend indicators, experiment with time-series forecasting, and visualize results.', category: 'FINANCIAL INTELLIGENCE',
    desc: 'Market intelligence with technical indicators, experimental forecasting, and interactive charts.',
    overview: 'StockVision AI combines market data analysis with an experimental deep-learning forecasting workflow. Historical stock prices are processed into indicators and sequences, a Bi-LSTM model explores price patterns, and a React dashboard presents charts, trends, and prediction context for study.',
    features: [
      {title:'Market data & charts', text:'Work with historical and current stock-market data from yfinance in a visual dashboard.'},
      {title:'Technical indicators', text:'Explore SMA, EMA, RSI, and MACD to study market trends and momentum.'},
      {title:'Bi-LSTM forecasting', text:'Experiment with time-series models built on historical stock-price patterns.'},
      {title:'Forecast evaluation', text:'Study prediction history, comparisons with actual prices, and model uncertainty.'}
    ],
    workflow:['Market data','Indicators & scaling','Bi-LSTM forecast','Dashboard & evaluation'],
    tags:['React','FastAPI','TensorFlow','Bi-LSTM','yfinance','Recharts'],
    status:'EXPERIMENTAL AI PROJECT', note:'Research and educational project; forecasts are not investment advice.',
    repo:'https://github.com/Aryan2624/StockVision-AI', icon:LineChart, color:'#ad385b'
  },
  {
    id: '04', title: 'Brain Tumor Classification', problem: 'Comparing image-based neural models requires consistent preprocessing and careful interpretation of predictions.', approach: 'Explore CNN and transfer-learning architectures with comparison and visual-inspection workflows.', category: 'COMPUTER VISION',
    desc: 'An MRI image-classification study comparing CNN and transfer-learning architectures.',
    overview: 'This deep-learning project investigates classifying brain MRI images using convolutional neural networks. Different neural-network architectures—including a custom CNN, ResNet50, and EfficientNet—are explored to understand model behavior and compare image-classification approaches.',
    features: [
      {title:'MRI image preparation', text:'Organize and prepare MRI images for a supervised image-classification workflow.'},
      {title:'CNN & transfer learning', text:'Explore a custom CNN alongside ResNet50 and EfficientNet architectures.'},
      {title:'Model comparison', text:'Evaluate different deep-learning approaches rather than relying on a single network.'},
      {title:'Visual explanations', text:'Explore Grad-CAM-style visualizations of image regions affecting predictions.'}
    ],
    workflow:['MRI images','Preprocessing','CNN / pretrained models','Prediction analysis'],
    tags:['Python','TensorFlow','CNN','ResNet50','EfficientNet','Grad-CAM'],
    status:'RESEARCH PROJECT', note:'Educational model exploration only; it is not a medical diagnosis tool.',
    repo:'https://github.com/Aryan2624/Brain-Tumor-Prediction', icon:Scan, color:'#d24b60'
  },
  {
    id: '05', title: 'Drone Path Optimization', problem: 'Shortest-path solutions may ignore energy use, constraints, and whether a route is safe or feasible.', approach: 'Model constraints, optimize candidate paths, explore Q-learning route choices, and check trajectory feasibility.', category: 'AUTONOMOUS SYSTEMS',
    desc: 'Exploring efficient drone routes using numerical optimization and reinforcement learning.',
    overview: 'Drone Path Optimization examines how algorithms can produce and refine travel paths while accounting for practical constraints such as obstacles, no-fly areas, and energy use. Gradient Descent and Heavy-Ball Momentum are used for optimization experiments, with Q-learning explored for route decisions.',
    features: [
      {title:'Route optimization', text:'Explore paths that trade off travel distance, time, and energy consumption.'},
      {title:'Numerical algorithms', text:'Compare Gradient Descent and Heavy-Ball Momentum for trajectory refinement.'},
      {title:'Reinforcement learning', text:'Use Q-learning to study route selection through a constrained environment.'},
      {title:'Safety & visualization', text:'Consider obstacles, no-fly zones, and route feasibility in plotted simulations.'}
    ],
    workflow:['Environment & constraints','Candidate path','GD / HB / Q-learning','Feasibility check'],
    tags:['Python','NumPy','Matplotlib','Gradient Descent','Heavy-Ball','Q-learning'],
    status:'OPTIMIZATION RESEARCH', note:'Simulation and algorithm exploration; no real-flight validation is claimed.',
    repo:'https://github.com/Aryan2624/Drone-Path-Optimization', icon:Plane, color:'#a93b31'
  },
  {
    id: '06', title: 'FinGuard AI', problem: 'Suspicious transactions, payment-related messages, and malicious links can have different risk signals.', approach: 'Explore a modular fraud-review concept that combines transaction indicators, NLP signals, and URL analysis.', category: 'FRAUD INTELLIGENCE',
    desc: 'An AI-based approach to suspicious transactions, UPI risks, and phishing signals.',
    overview: 'FinGuard AI is a fraud-intelligence project concept focused on examining suspicious financial interactions. It brings together transaction-pattern analysis, potential UPI-related risks, phishing-text signals, and unsafe URLs to explore how machine learning and NLP can support fraud review.',
    features: [
      {title:'Transaction risk signals', text:'Analyze suspicious patterns that may indicate unusual financial activity.'},
      {title:'UPI-related risk', text:'Explore indicators associated with potentially fraudulent UPI interactions.'},
      {title:'Phishing-message analysis', text:'Use NLP-based text signals to identify potentially deceptive communications.'},
      {title:'Malicious URL checks', text:'Consider link-based risk indicators alongside transaction and message analysis.'}
    ],
    workflow:['Transaction / message','Risk indicators','ML / NLP analysis','Fraud review'],
    tags:['Python','Machine Learning','NLP','Risk Analysis'],
    status:'PROJECT CONCEPT', note:'Features describe the intended scope, not verified production functionality.',
    repo:null, icon:Wallet, color:'#b72242'
  }
];
