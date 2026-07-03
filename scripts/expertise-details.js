/**
 * expertise-details.js — Complete expertise content data
 * This file contains all expertise topic content loaded dynamically on the detail page.
 * Data is organized by slug for query parameter based routing.
 */

window.EXPERTISE_DETAILS = {
  "head-and-neck-cancer": {
    title: "Head and Neck Cancer",
    subtitle: "Comprehensive surgical evaluation and treatment planning for head and neck cancers.",
    overview: "Head and neck cancer encompasses malignancies arising in the oral cavity, throat, voice box, salivary glands, and lymph nodes of the neck. This is a significant health concern, particularly in regions where tobacco and gutkha use is prevalent. Early diagnosis and specialized surgical intervention can significantly improve treatment outcomes.",
    keyPoints: [
      "Oral cavity, throat, and voice box are common sites",
      "Symptoms include non-healing mouth ulcers, neck lumps, and difficulty swallowing",
      "Early diagnosis dramatically improves survival rates",
      "Specialist surgical evaluation is crucial",
      "Multimodal treatment approach often required",
      "Rehabilitation and follow-up are essential for recovery"
    ],
    sections: [
      {
        heading: "Understanding Head and Neck Cancer",
        content: "Head and neck cancers develop from the tissues lining the mouth, nose, and throat. Common sites include the oral cavity (tongue, cheeks, gums), throat (pharynx), voice box (larynx), and salivary glands. These cancers can also involve the lymph nodes in the neck."
      },
      {
        heading: "Common Symptoms",
        content: "Key warning signs include: non-healing mouth ulcers lasting more than 2-3 weeks, persistent lump in the neck, persistent throat pain, difficulty swallowing (dysphagia), changes in voice or persistent hoarseness, unexplained weight loss, and bleeding from the mouth. Any of these symptoms warrant immediate medical evaluation."
      },
      {
        heading: "Risk Factors",
        content: "Tobacco use (smoking and chewing), alcohol consumption, HPV infection, and poor oral hygiene are major risk factors. However, cancers can also occur in individuals without these risk factors."
      },
      {
        heading: "Diagnosis and Staging",
        content: "Diagnosis involves clinical examination, endoscopy, biopsy, and imaging studies (CT/MRI/PET-CT). Accurate staging determines treatment strategy and prognosis. TNM staging system (Tumor, Node, Metastasis) helps classify cancer extent."
      },
      {
        heading: "Treatment Approach",
        content: "Treatment is individualized based on cancer stage, location, and patient factors. Options include surgery, radiation therapy, chemotherapy, or combination approaches. Specialist surgical evaluation ensures optimal treatment planning and functional preservation."
      },
      {
        heading: "Post-Treatment Management",
        content: "Follow-up surveillance, speech and swallowing rehabilitation, and psychosocial support are crucial for recovery. Regular monitoring helps detect any recurrence early and manage long-term side effects."
      }
    ],
    whenToConsult: [
      "Non-healing mouth ulcer present for more than 3 weeks",
      "Persistent neck swelling or lump",
      "Difficulty swallowing that persists",
      "Persistent voice changes or hoarseness",
      "Unexplained weight loss",
      "Recurrent mouth or throat infections",
      "Oral cavity pain that doesn't respond to treatment"
    ],
    treatment: [
      "Surgery: Primary modality for most operable tumors, often with neck dissection",
      "Radiation Therapy: Adjuvant treatment post-surgery or primary for advanced cases",
      "Chemotherapy: Usually combined with radiation for advanced/metastatic disease",
      "Targeted Therapy: Specific agents for HPV-related and other molecular subtypes",
      "Reconstruction: Restoration of form and function after surgical resection"
    ],
    faqs: [
      {
        question: "How is head and neck cancer detected early?",
        answer: "Regular dental check-ups, awareness of warning signs, and immediate evaluation of persistent symptoms are key. Clinical examination by a specialist can identify lesions not visible to patients."
      },
      {
        question: "What is the survival rate for head and neck cancer?",
        answer: "Survival rates vary significantly based on cancer stage at diagnosis. Early-stage cancers have much better prognosis (5-year survival >80% for stage I), while advanced stages have lower rates (30-40% for stage IV). This emphasizes the importance of early detection."
      },
      {
        question: "Will I lose my voice after throat cancer treatment?",
        answer: "Voice preservation is an important treatment goal. Many organ-preservation strategies exist. Speech and swallowing rehabilitation post-treatment helps restore function. Your surgeon will discuss these options during consultation."
      },
      {
        question: "What are the long-term effects of head and neck cancer treatment?",
        answer: "Side effects can include dry mouth, difficulty swallowing, speech changes, appearance changes, and limited neck movement. Many improve with rehabilitation. Your team will provide support for managing these effects."
      }
    ],
    related: [
      { slug: "diagnosing-head-and-neck-cancer", title: "Diagnosing Head and Neck Cancer" },
      { slug: "types-of-treatment-for-head-and-neck-cancer", title: "Types of Treatment for Head and Neck Cancer" },
      { slug: "how-cancer-spreads-in-the-body", title: "How Cancer Spreads in the Body" }
    ]
  },

  "diagnosing-head-and-neck-cancer": {
    title: "Diagnosing Head and Neck Cancer",
    subtitle: "Advanced diagnostic techniques for early detection and accurate staging",
    overview: "Accurate diagnosis of head and neck cancer requires a systematic approach combining clinical examination, specialized imaging, and tissue confirmation. Early and accurate diagnosis is crucial for treatment planning and predicting outcomes. Modern diagnostic techniques allow for precise staging and treatment planning.",
    keyPoints: [
      "Clinical examination detects most oral cavity lesions",
      "Endoscopy evaluates pharynx, larynx, and upper esophagus",
      "Biopsy/FNAC provides tissue diagnosis and histopathology",
      "Imaging (CT/MRI/PET-CT) determines disease extent",
      "Staging guides treatment selection",
      "Persistent symptoms warrant immediate evaluation"
    ],
    sections: [
      {
        heading: "Clinical Examination",
        content: "A thorough clinical examination includes inspection and palpation of the oral cavity, oropharynx, and neck. The surgeon examines all mucosal surfaces, checks for lumps, and assesses lymph node involvement. This physical examination forms the foundation of diagnosis."
      },
      {
        heading: "Endoscopic Evaluation",
        content: "Endoscopy allows direct visualization of the throat, voice box, and upper windpipe. Various types (laryngoscopy, pharyngoscopy, esophagoscopy) help visualize areas not accessible by simple examination. This is essential for identifying lesions and planning biopsies."
      },
      {
        heading: "Tissue Diagnosis: Biopsy and FNAC",
        content: "A tissue sample is essential for diagnosis. Fine Needle Aspiration Cytology (FNAC) is used for neck lumps. Open biopsy or brush biopsy is used for oral and throat lesions. Histopathological examination determines cancer type, grade, and specific characteristics."
      },
      {
        heading: "Imaging Studies",
        content: "CT (Computed Tomography) provides detailed information about tumor extent, bone involvement, and lymph node involvement. MRI offers excellent soft tissue detail. PET-CT helps identify metastases and active disease. The choice depends on tumor location and stage."
      },
      {
        heading: "Staging of Cancer",
        content: "TNM staging (Tumor size, Node involvement, Metastasis) is the standard system. Stage I-II are early-stage (better prognosis), while III-IV are advanced (requiring multimodal therapy). Accurate staging guides treatment selection and prognostic estimation."
      },
      {
        heading: "Why Persistent Symptoms Matter",
        content: "Any symptom persisting for more than 2-3 weeks should be evaluated. Symptoms like non-healing ulcers, persistent pain, or difficulty swallowing warrant urgent specialist consultation. Early-stage cancers detected through symptom-triggered evaluation have significantly better outcomes."
      }
    ],
    whenToConsult: [
      "Any mouth ulcer not healing within 3 weeks",
      "Persistent or recurring neck swelling",
      "Difficulty swallowing or persistent throat pain",
      "Hoarseness lasting more than 2 weeks",
      "Mouth pain not responding to conservative treatment",
      "Bleeding from mouth or throat",
      "Unexplained weight loss"
    ],
    treatment: [
      "Biopsy: Tissue confirmation of cancer diagnosis",
      "Imaging: CT/MRI/PET-CT for staging and treatment planning",
      "Endoscopy: Direct visualization and sampling of lesions",
      "Staging workup: Complete assessment of disease extent",
      "Multidisciplinary discussion: Determines optimal treatment plan"
    ],
    faqs: [
      {
        question: "Is biopsy necessary for diagnosis?",
        answer: "Yes, tissue confirmation is essential for cancer diagnosis, determining cancer type and characteristics. While imaging suggests malignancy, biopsy confirms it and guides treatment decisions."
      },
      {
        question: "Will diagnostic procedures be painful?",
        answer: "Most diagnostic procedures cause minimal discomfort. Local anesthesia or sedation is provided for endoscopy. Biopsy is usually well-tolerated with local anesthesia. Your doctor will ensure your comfort throughout."
      },
      {
        question: "How long does diagnosis take?",
        answer: "Initial evaluation might take 1-2 visits. Biopsy results typically available within 3-5 days. Complete staging including imaging might take 1-2 weeks. Your team will prioritize timely diagnosis and treatment planning."
      },
      {
        question: "What does the staging mean for my treatment?",
        answer: "Stage determines treatment intensity and combination. Early stages (I-II) might be managed with single modality (surgery or radiation). Advanced stages (III-IV) require multimodal therapy (surgery + radiation ± chemotherapy). Staging guides prognosis discussion."
      }
    ],
    related: [
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" },
      { slug: "types-of-treatment-for-head-and-neck-cancer", title: "Types of Treatment for Head and Neck Cancer" },
      { slug: "how-cancer-spreads-in-the-body", title: "How Cancer Spreads in the Body" }
    ]
  },

  "types-of-treatment-for-head-and-neck-cancer": {
    title: "Types of Treatment for Head and Neck Cancer",
    subtitle: "Multimodal surgical and medical approaches to optimize outcomes",
    overview: "Head and neck cancer treatment is individualized based on cancer stage, location, patient health, and functional goals. Modern treatment emphasizes function preservation while achieving cure. Treatment may involve surgery, radiation, chemotherapy, or targeted therapy, often in combination. A multidisciplinary team ensures optimal care.",
    keyPoints: [
      "Surgery is primary treatment for most operable tumors",
      "Radiation therapy destroys cancer cells and prevents recurrence",
      "Chemotherapy is used for advanced disease or sensitization",
      "Targeted therapy targets specific cancer characteristics",
      "Combination therapy often provides better outcomes",
      "Reconstruction restores function and appearance after surgery",
      "Treatment decisions are individualized based on cancer characteristics"
    ],
    sections: [
      {
        heading: "Surgical Treatment",
        content: "Surgery is the primary modality for most head and neck cancers when feasible. Procedures include tumor excision with adequate margins, neck dissection (removal of lymph nodes), and reconstruction if needed. Minimally invasive techniques (laser, endoscopic, robotic) preserve more normal tissue when applicable. Neck dissection addresses lymph node disease and removes tissue at risk for microscopic cancer."
      },
      {
        heading: "Radiation Therapy",
        content: "Radiation uses high-energy beams to destroy cancer cells. Modern techniques include intensity-modulated radiation therapy (IMRT) which targets tumors while minimizing damage to surrounding tissues. Radiation is used post-operatively to reduce recurrence risk, or as primary treatment in select cases. Standard course is 5-7 weeks of daily treatments."
      },
      {
        heading: "Chemotherapy",
        content: "Chemotherapy uses drugs to kill rapidly dividing cells. It's typically used for advanced cancers in combination with radiation. Concurrent chemoradiation (chemotherapy given with radiation) improves outcomes for advanced disease. Side effects require careful management, but benefits often outweigh risks in appropriate candidates."
      },
      {
        heading: "Targeted Therapy and Immunotherapy",
        content: "Targeted agents like cetuximab inhibit specific cancer-promoting pathways. Immunotherapy (checkpoint inhibitors) helps the immune system fight cancer, particularly in HPV-related and PD-L1 positive cancers. These are increasingly used for advanced or recurrent disease, offering sometimes better tolerance than traditional chemotherapy."
      },
      {
        heading: "Reconstructive Surgery",
        content: "After tumor removal, reconstruction restores form and function. Local flaps use nearby tissue, while free flaps (microvascular reconstruction) use tissue from distant sites. Reconstruction planning during initial surgery ensures optimal functional and cosmetic results. Rehabilitation then helps restore speech, swallowing, and appearance."
      },
      {
        heading: "Treatment Planning",
        content: "A multidisciplinary team (surgeon, radiation oncologist, medical oncologist, speech pathologist, nutritionist) meets to discuss each case. Treatment is individualized considering cancer stage/location, patient health, functional goals, and preferences. The goal is cure with maximal function preservation."
      }
    ],
    whenToConsult: [
      "Diagnosed with head and neck cancer",
      "Need treatment options discussion",
      "Want second opinion on treatment plan",
      "Experiencing side effects from current treatment",
      "Cancer recurrence or new symptoms",
      "Planning rehabilitation after treatment"
    ],
    treatment: [
      "Surgery with reconstruction for tumors amenable to operation",
      "Radiation therapy post-operatively or as primary treatment",
      "Concurrent chemoradiation for advanced disease",
      "Immunotherapy and targeted agents for selected patients",
      "Speech and swallowing rehabilitation",
      "Nutritional support during and after treatment",
      "Regular follow-up surveillance"
    ],
    faqs: [
      {
        question: "Why do I need multiple treatments?",
        answer: "Combining modalities (surgery + radiation ± chemotherapy) has better cure rates than single treatment, especially for advanced cancers. The team will explain why combination therapy is recommended for your specific cancer."
      },
      {
        question: "What are common side effects?",
        answer: "Surgery may cause temporary swallowing difficulty or speech changes. Radiation causes dry mouth, skin changes, and possible long-term swallowing issues. Chemotherapy causes fatigue, nausea, and hair loss. Most side effects are manageable, and rehabilitation helps recovery."
      },
      {
        question: "How long is the treatment course?",
        answer: "Surgery is typically one procedure. Radiation is usually 5-7 weeks of daily treatments. Chemotherapy varies by protocol. Total treatment from diagnosis to completion might be 2-4 months. Your team provides a detailed timeline."
      },
      {
        question: "Can function be preserved?",
        answer: "Modern techniques increasingly preserve speech, swallowing, and appearance. Minimally invasive surgery, function-preserving radiation, and reconstruction all aim to maintain quality of life. Goals are discussed with your team before treatment starts."
      }
    ],
    related: [
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" },
      { slug: "diagnosing-head-and-neck-cancer", title: "Diagnosing Head and Neck Cancer" },
      { slug: "how-cancer-spreads-in-the-body", title: "How Cancer Spreads in the Body" }
    ]
  },

  "how-cancer-spreads-in-the-body": {
    title: "How Cancer Spreads in the Body",
    subtitle: "Understanding metastasis and the importance of staging",
    overview: "Cancer spread (metastasis) is when cancer cells travel from the primary site to other parts of the body. Understanding how cancer spreads is crucial for staging, treatment planning, and prognosis. This process determines treatment intensity and survival expectations. Early detection before spread occurs significantly improves outcomes.",
    keyPoints: [
      "Local invasion: Cancer spreads to adjacent tissues",
      "Lymph node involvement: Cancer enters the lymphatic system",
      "Bloodstream spread: Cancer reaches distant organs via blood vessels",
      "Metastasis: Establishment of cancer in distant sites",
      "Staging determines treatment and prognosis",
      "Early treatment before spread improves cure rates",
      "Neck lymph nodes are the most common site of spread in head and neck cancers"
    ],
    sections: [
      {
        heading: "Local Invasion",
        content: "Cancer begins in the primary site (e.g., oral cavity, throat). As it grows, malignant cells invade adjacent normal tissues, destroying them. Local invasion determines surgical margins needed—we must remove the tumor with a border of normal tissue to ensure complete removal. The depth and extent of local invasion affects treatment options and reconstruction needs."
      },
      {
        heading: "Lymph Node Involvement",
        content: "Cancer cells can enter the lymphatic system and spread to regional lymph nodes (in the neck for head and neck cancers). This is called lymph node metastasis. Presence of lymph node involvement significantly affects prognosis and requires treatment (surgery and/or radiation). Lymph nodes are checked with physical examination and imaging."
      },
      {
        heading: "Bloodstream Spread",
        content: "Cancer cells can enter blood vessels and travel to distant organs. Common sites of blood spread from head and neck cancer include lungs, liver, and bones. The presence of distant metastasis means the cancer is stage IV and requires multimodal treatment. PET-CT helps detect distant metastases."
      },
      {
        heading: "Understanding Metastasis",
        content: "Metastasis is when cancer establishes itself at a distant site. Distant metastases from head and neck cancer usually occur in lungs, liver, or bones. Even distant metastases may be treated aggressively with combination therapy. Early detection before spread significantly improves cure rates."
      },
      {
        heading: "Staging and Spread",
        content: "TNM staging (Tumor size, Node involvement, Metastasis) incorporates spread information. Stage I-II: no or minimal spread. Stage III: significant local/nodal disease. Stage IV: distant metastasis or very advanced local disease. Staging guides treatment selection and helps predict outcomes."
      },
      {
        heading: "Why Early Treatment Matters",
        content: "Cancer detected before it spreads to lymph nodes or distant sites has much better prognosis and lower treatment intensity requirements. Early-stage cancers have 5-year survival rates 60-80%, while stage IV is 20-40%. This emphasizes critical importance of recognizing symptoms early and seeking prompt evaluation."
      }
    ],
    whenToConsult: [
      "Any persistent symptoms suggesting cancer",
      "Neck lump or enlargement",
      "Persistent mouth ulcer",
      "Difficulty swallowing",
      "Voice changes lasting more than 2 weeks",
      "Unexplained weight loss",
      "Any concern about potential cancer spread"
    ],
    treatment: [
      "Early diagnosis before spread occurs",
      "Appropriate staging with imaging (CT/MRI/PET-CT)",
      "Treatment based on extent of spread",
      "Surgery and/or radiation for local and nodal disease",
      "Chemotherapy or immunotherapy for advanced disease",
      "Regular surveillance to detect recurrence or new metastases"
    ],
    faqs: [
      {
        question: "If cancer has spread to lymph nodes, is it still curable?",
        answer: "Yes, many cancers with lymph node involvement are still curable, especially if there's no distant metastasis. Lymph node involvement increases cancer stage and requires more intensive treatment, but cure is achievable. Early treatment of nodal disease improves outcomes."
      },
      {
        question: "What's the difference between nodal disease and metastasis?",
        answer: "Nodal disease is cancer in lymph nodes near the primary site (regional nodes). Metastasis means cancer has spread to distant organs via bloodstream. Nodal disease is part of stage classification, while distant metastasis defines stage IV."
      },
      {
        question: "Will my cancer spread if left untreated?",
        answer: "Untreated cancers will likely progress and spread. This is why early diagnosis and prompt treatment are critical. Cancer tends to become more aggressive over time and spreads to lymph nodes and distant sites, dramatically worsening prognosis."
      },
      {
        question: "How is spread detected?",
        answer: "Physical examination detects enlarged lymph nodes. Imaging studies (CT/MRI/PET-CT) assess local invasion, nodal disease, and distant metastases. PET-CT is particularly good at detecting distant metastases. Your team will perform appropriate studies based on cancer type and risk."
      }
    ],
    related: [
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" },
      { slug: "diagnosing-head-and-neck-cancer", title: "Diagnosing Head and Neck Cancer" },
      { slug: "types-of-treatment-for-head-and-neck-cancer", title: "Types of Treatment for Head and Neck Cancer" }
    ]
  },

  "oral-precancerous-lesions-and-treatment": {
    title: "Oral Precancerous Lesions and Treatment",
    subtitle: "Early detection and management of potentially malignant oral disorders",
    overview: "Oral precancerous lesions (potentially malignant disorders) include leukoplakia, erythroplakia, and oral submucous fibrosis. These lesions have malignant transformation potential and require careful monitoring and often treatment. Early intervention prevents or delays cancer development. Habit cessation and regular follow-up are crucial.",
    keyPoints: [
      "Leukoplakia: White patches in the mouth with variable transformation risk",
      "Erythroplakia: Red patches with higher malignant transformation risk than leukoplakia",
      "Oral submucous fibrosis: Serious precancerous condition causing restricted mouth opening",
      "Tobacco and gutkha use are major risk factors",
      "Biopsy is essential for diagnosis and risk assessment",
      "Habit cessation is fundamental to management",
      "Regular monitoring is required even after treatment"
    ],
    sections: [
      {
        heading: "Leukoplakia",
        content: "Oral leukoplakia appears as white patches or plaques in the mouth that cannot be scraped off. Not all leukoplakias are cancerous, but some (dysplastic lesions) have malignant potential. Risk varies based on appearance and histopathology. Homogeneous lesions have lower risk, while non-homogeneous (speckled, verrucous) have higher risk. Biopsy determines malignant potential."
      },
      {
        heading: "Erythroplakia",
        content: "Oral erythroplakia appears as red patches or erosions in the mouth. These are more concerning than leukoplakia as they have higher malignant transformation rates (40-50%). Any red patch in the mouth should be evaluated immediately. Biopsy is mandatory for erythroplakia."
      },
      {
        heading: "Oral Submucous Fibrosis",
        content: "OSF is a serious precancerous condition characterized by progressive fibrosis of the oral mucosa and muscles. It causes restricted mouth opening (trismus), difficulty swallowing, and speech changes. Strongly associated with gutkha and areca nut use. Malignant transformation rate is 7-10%. Requires aggressive management and complete habit cessation."
      },
      {
        heading: "Risk Factors and Prevention",
        content: "Main risk factors: tobacco use, gutkha, pan masala, alcohol, and poor oral hygiene. Some lesions may be associated with HPV. Prevention requires complete cessation of harmful habits. Regular self-examination and dental check-ups help identify lesions early. Nutritional deficiencies (iron, B vitamins) may increase risk."
      },
      {
        heading: "Diagnosis and Management",
        content: "Clinical examination identifies suspicious lesions. Biopsy is essential to assess dysplasia and malignant potential. Management options include: habit cessation (crucial), observation with regular follow-up for low-risk lesions, medical therapy (topical agents, photodynamic therapy), and surgical excision for high-risk lesions or those with dysplasia."
      },
      {
        heading: "Follow-up and Monitoring",
        content: "After treatment, regular follow-up is essential to detect recurrence or malignant transformation. Patients with precancerous lesions require periodic clinical examination (every 3-6 months initially, then annually). Self-examination monthly and reporting any changes is important. Complete habit cessation significantly improves outcomes."
      }
    ],
    whenToConsult: [
      "Any white or red patch in the mouth",
      "Mouth ulcer not healing within 3 weeks",
      "Difficulty opening mouth or swallowing",
      "Persistent mouth pain",
      "Feeling of something stuck in throat",
      "Ongoing gutkha or tobacco use with mouth symptoms",
      "Family history of oral cancer"
    ],
    treatment: [
      "Clinical evaluation and biopsy of suspicious lesions",
      "Habit cessation (tobacco, gutkha, pan masala, alcohol)",
      "Observation with regular follow-up for low-risk lesions",
      "Topical agents or photodynamic therapy for select lesions",
      "Surgical excision for high-risk or dysplastic lesions",
      "Nutritional supplementation",
      "Regular follow-up and self-monitoring"
    ],
    faqs: [
      {
        question: "Does every white patch in the mouth become cancer?",
        answer: "No. While some leukoplakias have malignant potential, many remain benign. Biopsy determines dysplasia and cancer risk. Non-dysplastic lesions have low transformation risk, while dysplastic ones require careful management."
      },
      {
        question: "If I quit gutkha/tobacco, will the lesion disappear?",
        answer: "Habit cessation is crucial and may lead to regression of some lesions, especially if caught early. However, established dysplastic lesions don't always regress and require ongoing monitoring or treatment. Early habit cessation combined with treatment gives best outcomes."
      },
      {
        question: "What is the treatment for oral submucous fibrosis?",
        answer: "Management includes: complete habit cessation (essential), stretching exercises, topical and systemic medications, and sometimes surgical intervention to restore mouth opening. Early intervention is important as advanced fibrosis causes permanent restrictions."
      },
      {
        question: "How often should I be followed after treatment?",
        answer: "After treatment, follow-up is typically every 3-6 months for the first 2 years, then every 6-12 months. This allows detection of recurrence or malignant transformation early. Your doctor will recommend the appropriate schedule based on lesion type and risk."
      }
    ],
    related: [
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" },
      { slug: "oral-cancer-overview", title: "Oral Cancer Overview" },
      { slug: "oral-cancer-in-india", title: "Oral Cancer in India" }
    ]
  },

  "oral-cancer-in-india": {
    title: "Oral Cancer in India",
    subtitle: "Understanding epidemiology, risk factors, and prevention in the Indian context",
    overview: "Oral cancer is a significant health burden in India, with incidence rates among the highest globally. The disease is strongly associated with tobacco use, gutkha, pan masala, and alcohol—substances deeply rooted in cultural practices. Public awareness, early screening, and healthcare access improvements are essential for prevention and control.",
    keyPoints: [
      "India has one of the highest oral cancer burdens globally",
      "Gutkha, pan masala, and tobacco are major risk factors",
      "Oral cancer is often diagnosed late, limiting treatment options",
      "Young patients are increasingly affected",
      "Preventive screening and awareness can reduce burden",
      "Rural populations often lack access to early detection and treatment",
      "Cultural factors influence risk behavior and healthcare seeking"
    ],
    sections: [
      {
        heading: "Epidemiology in India",
        content: "Oral cancer is the third most common cancer in India (after cervical and breast cancers). India contributes significantly to global oral cancer burden. Incidence varies by region, with higher rates in tobacco-growing areas. Age of presentation is younger than in Western countries, often due to early and prolonged gutkha use starting in young adulthood or even adolescence."
      },
      {
        heading: "Risk Factors: The Indian Context",
        content: "Gutkha (a mixture of areca nut, tobacco, and lime) is the primary risk factor in India. Pan masala (areca nut preparation often with tobacco) is also widely consumed. Smoking and chewing tobacco contribute significantly. Alcohol use, often in combination with these substances, further increases risk. Paan (betel leaf with tobacco/gutkha) is a common habit. These substances are deeply cultural, making cessation challenging."
      },
      {
        heading: "Delayed Diagnosis Problem",
        content: "Many Indian patients present with advanced cancer due to: lack of awareness of warning signs, limited access to healthcare (especially rural areas), misconceptions about oral ulcers and lumps, and delays in seeking medical care. Advanced-stage cancers require more aggressive treatment and have worse outcomes. Early detection through awareness and screening is critical."
      },
      {
        heading: "Burden on Healthcare System",
        content: "The large number of oral cancer patients strains healthcare resources, especially in rural areas. Many patients cannot afford treatment, leading to poor outcomes. Treatment costs are high, often leading to financial hardship. Preventive strategies and public health measures are more cost-effective than treatment."
      },
      {
        heading: "Prevention and Screening",
        content: "Primary prevention: avoid tobacco, gutkha, and excessive alcohol. Secondary prevention: regular oral self-examination and dental check-ups to detect lesions early. Public health campaigns targeting young people before habit formation are crucial. Workplace screening in tobacco-growing regions can identify early lesions. Training healthcare workers to recognize oral lesions improves detection."
      },
      {
        heading: "Public Awareness and Education",
        content: "Educating populations about warning signs—non-healing mouth ulcers, persistent mouth pain, difficulty swallowing, neck lumps, voice changes—is essential. Celebrity and influencer-led campaigns can raise awareness. Schools and colleges should educate youth about risks. Community health workers can screen vulnerable populations."
      }
    ],
    whenToConsult: [
      "Any mouth ulcer not healing within 3 weeks",
      "Persistent mouth or throat pain",
      "Difficulty swallowing or chewing",
      "Neck lump or swelling",
      "Voice changes",
      "Bleeding from mouth or gums",
      "If you use gutkha, pan masala, or tobacco"
    ],
    treatment: [
      "Complete habit cessation (gutkha, tobacco, alcohol)",
      "Regular oral self-examination (monthly)",
      "Dental check-ups (every 6-12 months, more frequent if high-risk)",
      "Immediate evaluation of any suspicious lesion",
      "Biopsy of persistent lesions",
      "Appropriate cancer treatment if diagnosed",
      "Public awareness and education programs"
    ],
    faqs: [
      {
        question: "Is oral cancer preventable?",
        answer: "Yes, most oral cancers are preventable through: avoiding tobacco, gutkha, and excessive alcohol; maintaining good oral hygiene; and regular dental check-ups. Early detection of precancerous lesions prevents progression to cancer."
      },
      {
        question: "Why is gutkha so dangerous?",
        answer: "Gutkha combines areca nut (mildly carcinogenic), tobacco (highly carcinogenic), and lime (caustic). This combination is highly carcinogenic. Areca nut causes oral submucous fibrosis, restricting mouth opening. Regular gutkha use significantly increases oral cancer risk."
      },
      {
        question: "Can I survive if diagnosed with advanced oral cancer?",
        answer: "Advanced cancers are more challenging to treat and have lower cure rates than early-stage cancers. However, multimodal therapy (surgery, radiation, chemotherapy) can achieve cure even in advanced cases. Outcomes depend on cancer biology and patient factors. Early detection gives much better chances."
      },
      {
        question: "What should I do if I notice a suspicious lesion?",
        answer: "Seek evaluation from a qualified doctor or dentist immediately. Don't wait for the lesion to change. Early evaluation allows early diagnosis and treatment, which dramatically improves outcomes. Don't self-treat or ignore persistent oral symptoms."
      }
    ],
    related: [
      { slug: "oral-precancerous-lesions-and-treatment", title: "Oral Precancerous Lesions and Treatment" },
      { slug: "oral-cancer-overview", title: "Oral Cancer Overview" },
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" }
    ]
  },

  "oral-cancer-overview": {
    title: "Oral Cancer Overview",
    subtitle: "Complete understanding of oral cavity cancers, diagnosis, and treatment",
    overview: "Oral cancer (oral cavity squamous cell carcinoma) is cancer of the lips, tongue, cheeks, gums, floor of mouth, and hard palate. It is the most common type of head and neck cancer. Understanding oral cancer—its causes, symptoms, diagnosis, and treatment—empowers patients to seek timely care and achieve better outcomes.",
    keyPoints: [
      "Oral cavity cancer is the most common head and neck malignancy",
      "Squamous cell carcinoma accounts for 90% of oral cancers",
      "Tobacco and alcohol are major risk factors globally",
      "Symptoms include non-healing ulcers, pain, difficulty eating/swallowing",
      "Early-stage disease has excellent prognosis with treatment",
      "Surgery is primary treatment for most operable cancers",
      "Reconstruction can restore function and appearance"
    ],
    sections: [
      {
        heading: "Common Sites in the Oral Cavity",
        content: "Oral cavity cancer can develop on: tongue (most common site), buccal mucosa (cheek lining), gums, floor of mouth (under tongue), hard palate (roof of mouth), and lips. Different sites have different prognoses and treatment approaches. Tongue cancer tends to spread to lymph nodes more frequently. Cancer of the floor of mouth has higher risk of bilateral neck involvement."
      },
      {
        heading: "Types of Oral Cancer",
        content: "Squamous cell carcinoma (SCC) accounts for >90% of oral cancers. Minor salivary gland tumors occur from glands in the mucosa. Verrucous carcinoma is a slow-growing variant. Adenocarcinomas can arise from salivary glands. Mucosal melanomas are rare but aggressive. Histological type affects treatment and prognosis. Your pathologist will determine the type."
      },
      {
        heading: "Warning Signs and Symptoms",
        content: "Red flag symptoms include: non-healing mouth ulcer (most important—lasts >2 weeks), persistent mouth pain, difficulty chewing or swallowing (dysphagia), persistent throat pain, bleeding from mouth, speech changes, mouth opening restriction, unexplained weight loss, neck lump, and loose teeth. Any of these warrant immediate evaluation."
      },
      {
        heading: "Risk Factors",
        content: "Primary risk factors: tobacco use (smoking and chewing), alcohol, and their combination. HPV infection (especially HPV-16) causes some oral cancers, particularly at the base of tongue. Other factors: poor oral hygiene, chronic irritation, immunosuppression, and nutritional deficiencies. Some cancers occur without identified risk factors."
      },
      {
        heading: "Diagnosis and Staging",
        content: "Diagnosis requires tissue confirmation via biopsy. Staging with CT/MRI/PET-CT determines tumor extent and spread. TNM staging guides treatment. Early-stage disease (I-II) has better prognosis and often requires less aggressive treatment. Advanced disease (III-IV) requires multimodal therapy. Accurate staging is crucial for treatment planning."
      },
      {
        heading: "Treatment Approach",
        content: "Surgery is the primary treatment for most oral cancers. Radiation is added for advanced disease or when surgery isn't feasible. Chemotherapy is used for advanced disease, often combined with radiation. Reconstruction restores form and function after surgical resection. The goal is cure with functional and cosmetic preservation. Treatment is individualized based on cancer stage, location, and patient factors."
      }
    ],
    whenToConsult: [
      "Any mouth ulcer lasting more than 2 weeks",
      "Persistent mouth pain",
      "Difficulty swallowing or chewing",
      "Persistent sore throat",
      "Bleeding from mouth",
      "Mouth lump or swelling",
      "Speech changes",
      "Neck lump",
      "Unexplained weight loss"
    ],
    treatment: [
      "Clinical examination and biopsy",
      "Imaging for staging (CT/MRI/PET-CT)",
      "Surgical resection with adequate margins",
      "Neck dissection for nodal disease",
      "Reconstruction if needed",
      "Post-operative radiation ± chemotherapy",
      "Speech and swallowing rehabilitation",
      "Long-term surveillance"
    ],
    faqs: [
      {
        question: "What are the chances of survival with oral cancer?",
        answer: "5-year survival is ~65% overall. Stage I has ~80-90% survival, while stage IV has ~30-40%. Survival depends on tumor stage, patient health, and treatment adherence. Early detection dramatically improves survival. Your team will discuss prognosis based on your specific cancer characteristics."
      },
      {
        question: "Will I need all teeth removed?",
        answer: "Not necessarily. While teeth involved with tumor may need removal, the goal is to preserve healthy teeth. Sometimes teeth are removed to facilitate surgery or reconstruction. Your surgeon discusses tooth-related decisions before surgery."
      },
      {
        question: "What happens after treatment?",
        answer: "Regular follow-up is essential to detect recurrence early. Initially, visits every 1-3 months, then extending to every 3-6 months, then annually. Rehabilitation helps restore eating and speech. Most patients return to normal activities after recovery. Long-term quality of life is good for many survivors."
      },
      {
        question: "Can oral cancer recur?",
        answer: "Yes, recurrence can occur locally, in lymph nodes, or as distant metastasis. This is why follow-up surveillance is essential. Second cancers can also develop in the mouth or other sites. Risk is higher in continuing smokers/drinkers, emphasizing importance of habit cessation."
      }
    ],
    related: [
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" },
      { slug: "oral-precancerous-lesions-and-treatment", title: "Oral Precancerous Lesions and Treatment" },
      { slug: "oral-cancer-in-india", title: "Oral Cancer in India" }
    ]
  },

  "human-papilloma-virus-and-oral-cancer": {
    title: "Human Papilloma Virus and Oral Cancer",
    subtitle: "HPV's role in head and neck cancer development and prevention strategies",
    overview: "Human Papillomavirus (HPV) is responsible for a significant and growing proportion of head and neck cancers, particularly oropharyngeal cancers. HPV-positive cancers differ biologically and clinically from traditional tobacco-related cancers, with better treatment response and prognosis. Understanding HPV-related cancers enables better prevention and treatment strategies.",
    keyPoints: [
      "HPV is sexually transmitted and causes persistent infections",
      "HPV-16 is most oncogenic, HPV-18 and others less common",
      "HPV+ oropharyngeal cancer is increasing in developed countries",
      "HPV+ cancers have better prognosis than HPV- cancers",
      "Base of tongue and tonsil are common HPV+ cancer sites",
      "HPV vaccination prevents infection and cancer development",
      "HPV status guides treatment intensity decisions"
    ],
    sections: [
      {
        heading: "What is HPV?",
        content: "Human Papillomavirus (HPV) is a common virus transmitted through sexual contact, including oral sex. Over 200 HPV types exist, but only about 15 are oncogenic (cancer-causing). HPV-16 is responsible for ~50% of HPV+ oropharyngeal cancers and is the most dangerous. Most HPV infections resolve spontaneously, but persistent infection with high-risk types can cause cancer."
      },
      {
        heading: "HPV-Related Oropharyngeal Cancer",
        content: "HPV+ cancers typically arise at the base of tongue and in the tonsil (oropharyngeal region). They differ from oral cavity cancers (which are usually tobacco/alcohol-related). HPV+ oropharyngeal cancer occurs in younger patients often without tobacco/alcohol history. These cancers have distinct molecular characteristics and better treatment response."
      },
      {
        heading: "Oral Cavity vs. Oropharyngeal Cancer",
        content: "Oral cavity cancer (lips, tongue, cheeks, gums, hard palate) is usually tobacco/alcohol-related and HPV-negative. Oropharyngeal cancer (base of tongue, tonsils, soft palate, pharyngeal wall) is increasingly HPV-positive in developed countries. The distinction matters because HPV+ oropharyngeal cancer has better prognosis and different treatment considerations."
      },
      {
        heading: "HPV+ Cancer: Prognosis and Treatment",
        content: "HPV+ oropharyngeal cancers have significantly better prognosis than HPV- cancers of similar stage. 3-year overall survival for HPV+ is ~75%, while HPV- is ~45%. This better prognosis has led to discussion of treatment de-escalation for early HPV+ disease to reduce long-term side effects. However, advanced HPV+ disease still requires aggressive treatment."
      },
      {
        heading: "Symptoms and Diagnosis",
        content: "HPV+ oropharyngeal cancers often present as neck lymph node enlargement without obvious primary tumor. Symptoms include neck swelling, throat pain, difficulty swallowing, and sometimes ear pain. Diagnosis requires biopsy showing squamous cell carcinoma, plus HPV testing (via PCR, in-situ hybridization, or p16 immunohistochemistry)."
      },
      {
        heading: "Prevention: HPV Vaccination",
        content: "HPV vaccines (Cervarix, Gardasil, Gardasil 9) protect against high-risk HPV types. Vaccination is most effective in adolescents before sexual activity, but benefits adults up to age 45. Males and females can be vaccinated. Vaccination prevents persistent infection and subsequent cancer development. WHO recommends routine HPV vaccination programs."
      }
    ],
    whenToConsult: [
      "Neck lump or swelling without obvious mouth ulcer",
      "Persistent sore throat",
      "Difficulty swallowing",
      "Ear pain without ear infection",
      "Family history of HPV-related cancers",
      "Sexually active with multiple partners",
      "Questions about HPV vaccination",
      "Any throat symptoms persisting more than 2 weeks"
    ],
    treatment: [
      "HPV testing for all patients with oropharyngeal cancer",
      "Staging with imaging (CT/MRI/PET-CT)",
      "Surgery and/or radiation-based treatment",
      "Possible treatment de-escalation for early HPV+ disease",
      "Standard multimodal therapy for advanced disease",
      "HPV vaccination for prevention (adolescents and adults <45)",
      "Counseling on preventing transmission to partners"
    ],
    faqs: [
      {
        question: "If I have HPV, will I definitely get cancer?",
        answer: "No. Most people who get HPV infection clear it naturally. Only persistent infection with high-risk HPV types over many years can lead to cancer. Even then, cancer doesn't always develop. Vaccination prevents infection and cancer risk."
      },
      {
        question: "Can HPV cancer be transmitted to my partner?",
        answer: "Oral HPV can potentially be transmitted through oral sex, but transmission doesn't mean the partner will develop cancer. Vaccination protects from infection. Most infected people clear the virus naturally. If you have HPV-related cancer, discuss safe sexual practices with your partner."
      },
      {
        question: "Is HPV-positive cancer curable?",
        answer: "Yes. HPV+ oropharyngeal cancer has excellent cure rates with appropriate treatment. 3-year survival is ~75%. Early-stage HPV+ cancers have even better outcomes. Even advanced HPV+ cancers respond well to treatment. Better prognosis is one advantage of HPV+ cancer."
      },
      {
        question: "At what age should I get HPV vaccination?",
        answer: "Vaccination is most effective in adolescents (11-12 years) before sexual activity. However, it's beneficial for sexually active individuals up to age 45. Even if already exposed to some HPV types, the vaccine protects against the types it covers. Discuss with your doctor if vaccination is appropriate for you."
      }
    ],
    related: [
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" },
      { slug: "oral-cancer-overview", title: "Oral Cancer Overview" },
      { slug: "types-of-treatment-for-head-and-neck-cancer", title: "Types of Treatment for Head and Neck Cancer" }
    ]
  },

  "reconstruction-or-plastic-surgery-for-head-neck-cancer": {
    title: "Reconstruction or Plastic Surgery for Head & Neck Cancer",
    subtitle: "Restoring form, function, and quality of life after cancer surgery",
    overview: "Reconstruction is an integral part of head and neck cancer surgery. When a tumour is removed, it often leaves a defect in the oral cavity, jaw, throat, or face. Reconstructive surgery closes these defects, restores the ability to eat, speak, and swallow, and rehabilitates appearance. Modern microvascular flap techniques allow complex reconstruction with excellent functional and cosmetic outcomes.",
    keyPoints: [
      "Reconstruction restores eating, swallowing, and speech after surgery",
      "Microvascular free flaps are the gold standard for large defects",
      "Jaw (mandible) can be reconstructed with bone from the leg or hip",
      "Tongue and floor of mouth reconstruction preserves speech quality",
      "Skin and soft tissue defects are closed using local or free flaps",
      "Reconstruction is planned before cancer surgery for seamless execution"
    ],
    sections: [
      {
        heading: "Why Reconstruction is Needed",
        content: "Head and neck cancer surgery involves removing parts of the mouth, jaw, tongue, throat, or skin. Without reconstruction, patients face difficulty eating, speaking, and swallowing, as well as significant cosmetic disfigurement. Reconstruction aims to restore these vital functions and improve quality of life following curative surgery."
      },
      {
        heading: "Types of Reconstruction",
        content: "Reconstruction is tailored to the defect size and location. Small defects are closed primarily or with local flaps using nearby tissue. Medium defects use regional pedicled flaps (pectoralis major, deltopectoral). Large or complex defects require free flaps — tissue transferred from the forearm (radial forearm), thigh (anterolateral thigh), or leg (fibula) along with its blood supply using microsurgery."
      },
      {
        heading: "Microvascular Free Flap Surgery",
        content: "Free flap reconstruction involves harvesting skin, muscle, or bone from a distant site along with its supplying artery and vein, and connecting these vessels to recipient vessels in the neck using an operating microscope. Commonly used flaps include the radial forearm free flap (thin, pliable skin for tongue/floor of mouth), the anterolateral thigh flap (large skin and muscle defects), and the fibula free flap (jaw reconstruction with bone and skin)."
      },
      {
        heading: "Jaw (Mandible) Reconstruction",
        content: "When part of the lower jaw must be removed due to cancer invasion, reconstruction is essential for chewing, speaking, and maintaining facial contour. The fibula bone from the lower leg is the most reliable source for jaw reconstruction. The fibula is shaped to match the jaw contour, secured with titanium plates, and the overlying skin can also be included to reconstruct the mouth lining."
      },
      {
        heading: "Tongue and Oral Cavity Reconstruction",
        content: "The tongue and oral cavity lining are critical for speech and swallowing. Partial tongue defects can be reconstructed with local or forearm flaps, preserving mobility and speech. Total tongue reconstruction uses large muscle flaps. Floor of mouth and cheek lining defects are also reconstructed to prevent scar contracture and restore function."
      },
      {
        heading: "Recovery and Rehabilitation",
        content: "After reconstruction, patients work with speech therapists and dietitians to restore swallowing and speech. Most patients regain the ability to eat orally after healing. Dental rehabilitation including implants may be possible after jaw reconstruction. Physiotherapy helps with shoulder function if neck dissection was performed. Psychological support is also an important component of recovery."
      }
    ],
    whenToConsult: [
      "Planning cancer surgery that will involve removal of oral cavity, jaw, or throat tissue",
      "Large or complex head and neck tumour requiring wide excision",
      "Recurrent cancer requiring re-operation",
      "Concerns about speech or swallowing after anticipated surgery",
      "Need for jaw reconstruction after cancer removal",
      "Cosmetic concerns after prior cancer surgery"
    ],
    treatment: [
      "Primary closure: For small defects with sufficient surrounding tissue",
      "Local flaps: Using adjacent tissue to close nearby defects",
      "Pedicled flaps: Pectoralis major or deltopectoral flaps for medium defects",
      "Radial forearm free flap: Thin pliable skin for tongue and oral cavity",
      "Anterolateral thigh free flap: Large skin and soft tissue defects",
      "Fibula free flap: Jaw reconstruction combining bone and skin",
      "Dental implants: Following jaw reconstruction for chewing rehabilitation"
    ],
    faqs: [
      {
        question: "Will I be able to eat and speak normally after reconstruction?",
        answer: "Most patients recover good functional speech and swallowing, though it depends on the extent of the original resection. The goal is restoration of oral intake and intelligible speech. Speech therapy and swallowing rehabilitation are part of the recovery plan and significantly improve outcomes."
      },
      {
        question: "Where is the tissue for reconstruction taken from?",
        answer: "Most commonly from the forearm (radial forearm flap), thigh (anterolateral thigh flap), or lower leg (fibula for jaw). These donor sites are chosen because they provide reliable tissue with good blood supply, and the functional impact at the donor site is minimal."
      },
      {
        question: "How long does reconstruction surgery take?",
        answer: "Combined cancer resection and reconstruction can take 6–12 hours depending on complexity. Microvascular free flap cases typically take longer due to the precision required for vessel anastomosis. The surgery is performed under general anaesthesia with a dedicated surgical team."
      },
      {
        question: "Is reconstruction done at the same time as cancer surgery?",
        answer: "Yes, in most cases reconstruction is planned and performed in the same operation as the cancer resection. This is called immediate reconstruction. It reduces the total number of surgeries and shortens the overall recovery period. In rare cases, delayed reconstruction is planned if post-operative radiation is likely to affect healing."
      }
    ],
    related: [
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" },
      { slug: "types-of-treatment-for-head-and-neck-cancer", title: "Types of Treatment for Head and Neck Cancer" },
      { slug: "parotid-surgery", title: "Parotid Surgery" }
    ]
  },

  "salivary-glands-and-tumours-of-salivary-gland": {
    title: "Salivary Glands and Tumours of Salivary Gland",
    subtitle: "Expert diagnosis and surgical management of salivary gland tumours",
    overview: "The salivary glands — parotid, submandibular, and sublingual — produce saliva essential for digestion and oral health. Tumours of the salivary glands can be benign or malignant. Benign tumours are more common (especially pleomorphic adenoma in the parotid) but may recur if inadequately excised. Malignant salivary gland tumours require wider excision and often post-operative radiation. Expert surgical management is critical to preserve facial nerve function while achieving complete tumour removal.",
    keyPoints: [
      "Parotid gland is the most common site of salivary gland tumours",
      "Most parotid tumours (80%) are benign — pleomorphic adenoma is the most common",
      "Facial nerve runs through the parotid — preservation is a surgical priority",
      "Submandibular gland tumours have a higher malignancy rate than parotid",
      "Malignant tumours require wider excision and neck dissection",
      "Biopsy is usually avoided before surgery to prevent tumour spillage"
    ],
    sections: [
      {
        heading: "Anatomy of Salivary Glands",
        content: "There are three pairs of major salivary glands: the parotid (largest, in front of the ear), submandibular (under the jaw), and sublingual (under the tongue). Hundreds of minor salivary glands line the mouth, lips, palate, and throat. The facial nerve — which controls all facial movement — passes through the parotid gland, making parotid surgery technically demanding."
      },
      {
        heading: "Types of Salivary Gland Tumours",
        content: "Benign tumours include pleomorphic adenoma (most common, slow-growing, may become malignant if untreated), Warthin's tumour (common in men, often bilateral, usually in parotid), and basal cell adenoma. Malignant tumours include mucoepidermoid carcinoma (most common malignant salivary tumour), adenoid cystic carcinoma (slow-growing but tends to invade nerves), acinic cell carcinoma, and carcinoma ex-pleomorphic adenoma (arising from an untreated benign tumour)."
      },
      {
        heading: "Symptoms and Diagnosis",
        content: "Most salivary gland tumours present as a painless lump near the ear, jaw, or under the tongue. Features suggesting malignancy include rapid growth, pain, facial nerve weakness, skin fixation, or enlarged neck nodes. Investigation includes ultrasound with FNAC for tissue diagnosis, CT or MRI for extent, and PET-CT for malignant tumours to detect spread."
      },
      {
        heading: "Surgical Treatment",
        content: "Surgery is the primary treatment for salivary gland tumours. For parotid tumours, superficial parotidectomy removes the outer lobe of the parotid while preserving the facial nerve. Total parotidectomy is required for deep lobe tumours. Submandibular gland excision removes the entire gland. For malignant tumours, wider resection and neck dissection are performed."
      },
      {
        heading: "Facial Nerve Preservation",
        content: "Preserving the facial nerve is the key challenge in parotid surgery. The nerve is meticulously dissected and protected throughout the procedure. Intra-operative facial nerve monitoring helps identify and protect nerve branches. Only if the nerve is directly invaded by malignancy is it sacrificed, with reconstruction using nerve grafts."
      },
      {
        heading: "Post-Operative Care",
        content: "After parotidectomy, a drain is kept for 24-48 hours. Frey's syndrome (flushing and sweating over the cheek while eating) may occur due to nerve regeneration patterns and is managed with topical antiperspirants. Dry mouth after gland removal is usually temporary as other glands compensate. Radiation is added after surgery for malignant tumours."
      }
    ],
    whenToConsult: [
      "Painless lump near the ear, jaw, or under the chin",
      "Rapidly growing swelling in the face or neck",
      "Facial weakness or asymmetry with a parotid lump",
      "Pain in the cheek or ear associated with a lump",
      "Difficulty opening the mouth with jaw-region swelling",
      "Recurrent lump after prior salivary gland surgery"
    ],
    treatment: [
      "Superficial parotidectomy: For tumours in outer lobe of parotid with facial nerve preservation",
      "Total parotidectomy: For deep lobe or malignant tumours",
      "Submandibular gland excision: For tumours of the submandibular gland",
      "Neck dissection: For malignant tumours with nodal involvement",
      "Post-operative radiation: For malignant salivary tumours after surgery",
      "Facial nerve monitoring: Intra-operative to protect nerve during surgery"
    ],
    faqs: [
      {
        question: "Will my facial nerve be affected by parotid surgery?",
        answer: "Facial nerve preservation is the primary goal of parotid surgery and is achieved in the vast majority of benign tumour operations. Temporary weakness may occur due to nerve handling but usually recovers fully within weeks. Permanent facial nerve injury is rare with experienced surgeons and is only anticipated when the nerve is directly invaded by malignancy."
      },
      {
        question: "Is FNAC (needle biopsy) necessary before surgery?",
        answer: "FNAC of the lump helps differentiate benign from malignant lesions and guides surgical planning. Open biopsy is generally avoided as it can spread benign tumour cells and complicates subsequent surgery. The decision to proceed with FNAC is made by the surgeon based on clinical and imaging findings."
      },
      {
        question: "Can a removed salivary gland tumour come back?",
        answer: "Benign tumours like pleomorphic adenoma can recur — especially if incompletely excised — and these recurrences are difficult to manage. This is why an adequate margin of normal tissue is removed even for benign tumours. Malignant tumours may recur locally or spread to nodes, which is why adjuvant radiation is often given."
      },
      {
        question: "Will my mouth become dry after gland removal?",
        answer: "Some dryness may occur initially after submandibular gland removal, but the parotid and sublingual glands continue to provide saliva. After parotidectomy, the other salivary glands compensate. Significant persistent dry mouth is uncommon after removal of a single gland. Staying well hydrated and using saliva substitutes can help during the adjustment period."
      }
    ],
    related: [
      { slug: "parotid-surgery", title: "Parotid Surgery" },
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" },
      { slug: "reconstruction-or-plastic-surgery-for-head-neck-cancer", title: "Reconstruction Surgery for Head and Neck Cancer" }
    ]
  },

  "parotid-surgery": {
    title: "Parotid Surgery",
    subtitle: "Precise surgical management of parotid tumours with facial nerve preservation",
    overview: "The parotid gland is the largest salivary gland, located in front of and below the ear. Parotid surgery (parotidectomy) is performed for both benign and malignant tumours. The critical challenge is the facial nerve, which passes through the parotid gland and controls all movements of the face. Expert surgical technique with intra-operative nerve monitoring ensures tumour removal while preserving facial function in the vast majority of patients.",
    keyPoints: [
      "Parotid tumours are the most common salivary gland neoplasms",
      "80% of parotid tumours are benign — pleomorphic adenoma is most common",
      "The facial nerve runs through the parotid — its preservation is paramount",
      "Intra-operative nerve monitoring reduces risk of facial nerve injury",
      "Superficial parotidectomy is standard for most benign tumours",
      "Cosmetic incision design minimizes visible scarring"
    ],
    sections: [
      {
        heading: "What is the Parotid Gland?",
        content: "The parotid gland is a large salivary gland in front of the ear, on either side of the face. It produces saliva that flows into the mouth through the parotid (Stensen's) duct. The facial nerve — which controls eyebrow raising, eye closure, smiling, and lower lip movement — splits into multiple branches as it passes through the parotid. This anatomy is the central challenge of parotid surgery."
      },
      {
        heading: "Why Parotid Surgery is Needed",
        content: "Parotidectomy is indicated for tumours of the parotid gland. Most parotid lumps are benign but require excision because benign pleomorphic adenoma can transform to malignancy over time if left untreated, and because it is not possible to reliably distinguish benign from malignant by imaging alone. Malignant parotid tumours require surgery with adequate margins and neck dissection."
      },
      {
        heading: "The Surgical Approach",
        content: "Parotidectomy is performed under general anaesthesia. The incision is carefully designed in front of the ear, curving into the hairline and behind the earlobe to minimize visible scarring. The facial nerve is identified at its exit from the skull base (stylomastoid foramen) and meticulously traced through the gland. The tumour-bearing portion of the gland is then removed while the nerve is protected throughout."
      },
      {
        heading: "Superficial vs Total Parotidectomy",
        content: "Superficial parotidectomy removes the portion of the gland above the facial nerve (where most tumours arise). Total parotidectomy removes the entire gland (both deep and superficial lobes) and is required for deep lobe tumours or malignant lesions. Extended resection including skin, adjacent muscle, or mandible may be needed for locally advanced malignancy."
      },
      {
        heading: "Intra-operative Facial Nerve Monitoring",
        content: "Facial nerve integrity monitoring (FNIM) uses continuous electromyography (EMG) of facial muscles during surgery. It provides real-time feedback when instruments approach the nerve, allowing the surgeon to adjust technique and minimize nerve trauma. This technology improves safety margins, especially in difficult cases involving revision surgery, deep lobe tumours, or malignant disease."
      },
      {
        heading: "Recovery After Parotidectomy",
        content: "Most patients are discharged within 1-2 days. Temporary facial weakness due to nerve handling usually resolves within weeks to months. Frey's syndrome — facial flushing or sweating while eating — may develop due to aberrant nerve regeneration and is managed with topical antiperspirants or Botox injections. A slight depression below the ear where the gland was removed is expected and usually not cosmetically significant."
      }
    ],
    whenToConsult: [
      "Lump in front of or below the ear",
      "Swelling that persists for more than 4 weeks",
      "Facial weakness associated with a parotid lump (urgent — suggests malignancy)",
      "Pain in the cheek or ear with an adjacent lump",
      "Skin overlying a parotid lump that appears tethered or ulcerated",
      "Prior parotid surgery with recurrent swelling"
    ],
    treatment: [
      "Superficial parotidectomy: Removes outer lobe with facial nerve preservation — standard for most tumours",
      "Total parotidectomy: Removes entire gland — for deep lobe or malignant tumours",
      "Extended parotidectomy: Includes skin, muscle, or mandible for locally advanced malignancy",
      "Neck dissection: Lymph node removal for malignant parotid tumours",
      "Adjuvant radiation: Post-operative for malignant tumours",
      "Intra-operative nerve monitoring: Standard safety measure during parotidectomy"
    ],
    faqs: [
      {
        question: "How common is facial nerve injury in parotid surgery?",
        answer: "With experienced surgeons using intra-operative nerve monitoring, permanent facial nerve injury is less than 1–2% for benign tumours. Temporary weakness after surgery is more common (10–20%) but almost always recovers fully within weeks to months. The risk is higher for malignant tumours, revision surgery, or deep lobe disease."
      },
      {
        question: "Will there be a visible scar after parotidectomy?",
        answer: "The incision is designed to follow natural skin creases in front of the ear and behind the earlobe, similar to a facelift incision. Over time, scars fade and become less visible. Most patients are satisfied with the cosmetic outcome. The slight hollowness below the ear can sometimes be addressed with fat grafting during or after surgery."
      },
      {
        question: "Is parotid surgery done under local or general anaesthesia?",
        answer: "Parotidectomy is performed under general anaesthesia because the procedure is lengthy (2–4 hours), requires complete stillness for precise nerve dissection, and necessitates intra-operative nerve monitoring which requires the patient to be asleep. You will be assessed for fitness for general anaesthesia beforehand."
      },
      {
        question: "What is Frey's syndrome and how is it treated?",
        answer: "Frey's syndrome (gustatory sweating) occurs in some patients after parotidectomy — they experience flushing or sweating over the cheek when eating or smelling food. It results from reinnervation of sweat glands by salivary nerve fibres. It can be managed with topical antiperspirant creams or Botox injections into the affected area, which provide lasting relief."
      }
    ],
    related: [
      { slug: "salivary-glands-and-tumours-of-salivary-gland", title: "Salivary Glands and Tumours of Salivary Gland" },
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" },
      { slug: "reconstruction-or-plastic-surgery-for-head-neck-cancer", title: "Reconstruction Surgery for Head and Neck Cancer" }
    ]
  },

  "what-is-cancer": {
    title: "What is Cancer? Symptoms and Risk Factors of Oral Cancer",
    subtitle: "Understanding cancer biology and the warning signs of oral cancer",
    overview: "Cancer is an abnormal, uncontrolled growth of cells that can invade surrounding tissue and spread to other parts of the body. Oral cancer — which includes cancers of the lips, tongue, cheeks, floor of mouth, palate, and gums — is one of the most common cancers in India. Awareness of early warning signs and risk factors is the key to early detection, when treatment outcomes are significantly better.",
    keyPoints: [
      "Cancer is uncontrolled cell growth due to mutations in cell regulation genes",
      "Oral cancer is the most common cancer in Indian men",
      "Tobacco — in any form — is the single biggest risk factor",
      "A non-healing mouth ulcer for more than 3 weeks needs immediate evaluation",
      "Early-stage oral cancer has cure rates exceeding 80%",
      "Regular self-examination of the mouth can detect changes early"
    ],
    sections: [
      {
        heading: "What is Cancer?",
        content: "Every cell in the body has built-in mechanisms to control its growth and division. Cancer occurs when mutations accumulate in genes that regulate this growth, causing cells to multiply uncontrollably, invade adjacent tissues, and eventually spread (metastasize) to distant organs through the blood or lymph. A tumour is a mass of these abnormal cells. Benign tumours do not invade or spread; malignant tumours (cancers) do."
      },
      {
        heading: "What is Oral Cancer?",
        content: "Oral cancer refers to malignancies arising in the oral cavity — including the lips, tongue (especially the sides), floor of the mouth, inner cheeks, gums, and hard palate. Oropharyngeal cancer affects the soft palate, base of tongue, and tonsils. Together these form a significant proportion of head and neck cancers. Squamous cell carcinoma is the most common type, arising from the surface lining cells."
      },
      {
        heading: "Risk Factors for Oral Cancer",
        content: "The most significant risk factor in India is tobacco use in any form — smoked (cigarettes, bidis) or smokeless (gutkha, pan masala, khaini). Alcohol use, especially combined with tobacco, multiplies the risk substantially. Betel nut (areca nut) chewing — with or without tobacco — is a major independent risk factor. Poor oral hygiene, chronic irritation from sharp teeth or ill-fitting dentures, and nutritional deficiencies are contributing factors."
      },
      {
        heading: "Early Warning Signs (ALARM Signs)",
        content: "A non-healing ulcer in the mouth lasting more than 2–3 weeks is the most important warning sign and must be evaluated immediately. Other warning signs include: a white or red patch in the mouth that does not rub off (leukoplakia or erythroplakia), a lump or thickening inside the cheek, difficulty chewing, swallowing, or moving the tongue, persistent numbness of the lip or tongue, and unexplained bleeding from the mouth."
      },
      {
        heading: "How Oral Cancer Progresses",
        content: "Most oral cancers begin as a precancerous change — a white patch (leukoplakia), red patch (erythroplakia), or submucosal fibrosis (hardening due to areca nut). Over months to years, these may transform into early cancer (small ulcer or growth), then into invasive cancer that spreads to adjacent tissue and cervical lymph nodes. Metastasis to lungs and liver occurs in advanced disease. Early intervention at the precancerous or early-cancer stage significantly improves survival."
      },
      {
        heading: "Diagnosis and Staging",
        content: "Diagnosis involves clinical examination, biopsy of suspicious lesions, and imaging (CT/MRI) to determine the extent of local disease and lymph node involvement. PET-CT is used for advanced stages to detect distant metastasis. Staging (TNM system) guides treatment. Early-stage (I/II) cancers are managed with surgery or radiation alone; advanced stages require combined modality therapy."
      }
    ],
    whenToConsult: [
      "Any mouth ulcer not healing within 2–3 weeks",
      "White or red patch in the mouth that does not go away",
      "Lump or thickening in the cheek, tongue, or gum",
      "Difficulty opening the mouth (trismus) or swallowing",
      "Unexplained bleeding or numbness in the mouth",
      "Swelling in the neck with or without mouth symptoms"
    ],
    treatment: [
      "Biopsy: Tissue confirmation of suspicious lesion",
      "Imaging: CT/MRI/PET-CT for staging",
      "Surgery: Wide local excision with adequate margins ± neck dissection",
      "Radiation therapy: As primary treatment for early-stage or adjuvant after surgery",
      "Chemotherapy: Combined with radiation for advanced or unresectable disease",
      "Laser ablation: For small superficial precancerous or early cancerous lesions"
    ],
    faqs: [
      {
        question: "Can oral cancer be cured?",
        answer: "Yes. Early-stage (Stage I and II) oral cancer has cure rates of 80–90% with appropriate surgery or radiation. Even Stage III disease has reasonable cure rates with combined surgery and radiation. Advanced Stage IV disease is more challenging but not hopeless. The key is early detection — any non-healing ulcer must be evaluated without delay."
      },
      {
        question: "I have been chewing gutka for years. Should I be worried?",
        answer: "Long-term tobacco and areca nut use significantly increases oral cancer risk. You should have a thorough oral examination by a specialist. Even if no cancer is found, precancerous changes may be present that need monitoring or treatment. Quitting tobacco and areca nut use is the single most important step you can take to reduce your risk."
      },
      {
        question: "Is a white patch in the mouth dangerous?",
        answer: "A white patch that cannot be rubbed off (leukoplakia) is a potentially premalignant lesion. The risk of it becoming cancer depends on its appearance — uniformly white patches carry lower risk than non-homogeneous or red-speckled patches. All suspicious white patches should be evaluated by a specialist and biopsied if indicated."
      },
      {
        question: "How can I examine my mouth for early cancer?",
        answer: "Monthly self-examination takes only 2 minutes. Stand in good light in front of a mirror. Look at and feel: both sides of the tongue, the floor of the mouth, inner cheeks and gums, the lips, and the roof of the mouth. Feel for any lumps in the neck. Report any non-healing ulcer, white or red patch, or unexplained lump to a doctor promptly."
      }
    ],
    related: [
      { slug: "oral-cancer-overview", title: "Oral Cancer Overview" },
      { slug: "oral-cancer-in-india", title: "Oral Cancer in India" },
      { slug: "oral-precancerous-lesions-and-treatment", title: "Oral Precancerous Lesions and Treatment" }
    ]
  },

  "why-oral-cancer": {
    title: "Why Do People Who Have Never Used Tobacco or Alcohol Get Oral Cancer?",
    subtitle: "Understanding non-traditional risk factors and emerging causes of oral cancer",
    overview: "While tobacco and alcohol account for the majority of oral cancer cases, a significant proportion of patients — particularly younger individuals and women — develop oral cancer without any history of tobacco or alcohol use. Human Papillomavirus (HPV) infection, chronic irritation, genetic susceptibility, immune suppression, and nutritional deficiencies all play roles. Understanding these non-traditional risk factors is essential for awareness, early detection, and prevention.",
    keyPoints: [
      "Up to 25% of oral cancers occur in people without tobacco or alcohol use",
      "HPV infection — especially HPV-16 — is a major cause of oropharyngeal cancer",
      "Chronic irritation from sharp teeth or ill-fitting dentures can trigger cancer",
      "Genetic predisposition and family history are significant risk factors",
      "Immune-suppressed individuals (post-transplant, HIV) have higher risk",
      "Nutritional deficiencies — especially iron and Vitamin A — increase risk"
    ],
    sections: [
      {
        heading: "The Misconception About Oral Cancer",
        content: "Many people believe oral cancer only affects tobacco or alcohol users. This misconception leads to delayed presentation in non-users who dismiss early warning signs. In fact, a growing proportion of oral and oropharyngeal cancers occur in individuals without these conventional risk factors. Understanding the full spectrum of causes ensures timely diagnosis in all patients."
      },
      {
        heading: "Human Papillomavirus (HPV)",
        content: "HPV — particularly HPV-16 — is now recognized as a major driver of oropharyngeal cancers (base of tongue and tonsils). HPV-related cancers are increasing globally, especially in younger adults and in populations with lower tobacco use. These cancers arise from persistent HPV infection of the throat, often contracted years or decades before the cancer develops. HPV-related cancers generally respond better to treatment and carry a more favourable prognosis than tobacco-related cancers."
      },
      {
        heading: "Chronic Irritation and Trauma",
        content: "Long-standing irritation of the oral mucosa can trigger malignant transformation. Sources include sharp or broken teeth, ill-fitting dentures, rough dental work, or chronic cheek biting. The irritation causes repeated cycles of injury and repair in the same spot, increasing the chance of DNA mutations accumulating over time. This mechanism explains why tongue cancer sometimes arises along the lateral border adjacent to a sharp tooth."
      },
      {
        heading: "Genetic and Familial Factors",
        content: "Inherited genetic variations can affect DNA repair capacity, making some individuals more susceptible to developing cancer even without heavy carcinogen exposure. Certain rare genetic syndromes (Fanconi anaemia, Dyskeratosis congenita) carry very high lifetime risk of oral cancer. A family history of head and neck or oral cancer may also increase individual risk and should prompt closer surveillance."
      },
      {
        heading: "Immune Suppression",
        content: "The immune system plays an active role in identifying and destroying early cancer cells. When immune function is compromised — after organ transplantation requiring immunosuppressive drugs, in HIV infection, or in autoimmune disease treated with immunosuppressants — this surveillance is reduced. As a result, immune-suppressed individuals have a significantly higher risk of developing oral and oropharyngeal cancers and require more vigilant monitoring."
      },
      {
        heading: "Nutritional Deficiencies",
        content: "Deficiencies in iron (causing Plummer-Vinson syndrome), Vitamin A, and Vitamin C impair the health and repair capacity of the oral mucosa, increasing vulnerability to malignant transformation. Poor diet, malnutrition, and conditions affecting nutrient absorption can therefore contribute to oral cancer risk, especially when combined with other factors. Maintaining good nutrition supports mucosal integrity and immune function."
      }
    ],
    whenToConsult: [
      "Non-healing oral ulcer in a non-tobacco, non-alcohol user",
      "Persistent sore throat or difficulty swallowing in a younger adult",
      "Family history of oral or head and neck cancer",
      "Long-standing irritation from a sharp tooth or denture with mucosal change",
      "Known HPV infection with throat or mouth symptoms",
      "Immune-suppressed patient with any new oral lesion"
    ],
    treatment: [
      "Clinical evaluation and biopsy: For any suspicious lesion regardless of risk factor history",
      "HPV testing: Of tumour tissue to determine HPV status and guide treatment",
      "Dental assessment: Remove chronic irritants (sharp teeth, ill-fitting dentures)",
      "Nutritional correction: Iron, Vitamin A supplementation if deficient",
      "HPV vaccination: For prevention in adolescents and eligible adults",
      "Surgery and/or radiation: Standard treatment for diagnosed oral cancer"
    ],
    faqs: [
      {
        question: "I have never smoked or drunk alcohol. Can I still get mouth cancer?",
        answer: "Yes. While tobacco and alcohol are the leading risk factors, a significant proportion of oral and oropharyngeal cancers occur in people without these habits. HPV infection, chronic dental irritation, genetic factors, and immune suppression are important causes. Any non-healing sore in the mouth must be evaluated by a doctor regardless of your lifestyle habits."
      },
      {
        question: "How does HPV cause throat cancer if I have never smoked?",
        answer: "HPV infects the mucous membranes of the mouth and throat. Persistent infection with high-risk HPV types (especially HPV-16) can cause changes in the cells lining the throat (oropharynx) that eventually lead to cancer. HPV-related oropharyngeal cancer is becoming increasingly common globally. It is distinct from tobacco-related cancer in its biology and generally has a better prognosis."
      },
      {
        question: "Should non-smokers and non-drinkers still worry about oral cancer?",
        answer: "Yes, regular self-examination and prompt reporting of any persistent oral symptom (ulcer, white/red patch, lump, swallowing difficulty) is important for everyone. If you are immune-suppressed, have a family history of oral cancer, or have chronic dental irritation, you should have periodic specialist check-ups. Awareness without tobacco or alcohol habits is just as important."
      },
      {
        question: "Can HPV vaccination prevent oral cancer?",
        answer: "HPV vaccines protect against the high-risk HPV types that cause most HPV-related oropharyngeal cancers. They are most effective when given before HPV exposure (ideally in adolescence). As vaccination programmes expand, the incidence of HPV-related head and neck cancers is expected to decline. If you are in the eligible age group, ask your doctor about HPV vaccination."
      }
    ],
    related: [
      { slug: "human-papilloma-virus-and-oral-cancer", title: "Human Papillomavirus and Oral Cancer" },
      { slug: "oral-cancer-overview", title: "Oral Cancer Overview" },
      { slug: "what-is-cancer", title: "What is Cancer? Symptoms and Risk Factors" }
    ]
  },

  "thyroid-cancer": {
    title: "Thyroid Cancer",
    subtitle: "Expert surgical management of thyroid cancer with excellent long-term outcomes",
    overview: "Thyroid cancer is the most common endocrine malignancy. It often presents as a painless thyroid nodule or neck lump. Most thyroid cancers — especially papillary and follicular types — are highly treatable and carry an excellent prognosis when diagnosed and managed appropriately. Surgical removal (thyroidectomy) by an experienced surgeon is the cornerstone of treatment. Recurrent laryngeal nerve and parathyroid gland preservation are key surgical priorities.",
    keyPoints: [
      "Papillary thyroid carcinoma is the most common type — generally very treatable",
      "Most thyroid cancers present as a painless lump in the front of the neck",
      "Ultrasound with FNAC is the key investigation for thyroid nodules",
      "Thyroidectomy is the main surgical treatment",
      "Recurrent laryngeal nerve (voice nerve) preservation is a surgical priority",
      "Lifelong thyroid hormone replacement is required after total thyroidectomy"
    ],
    sections: [
      {
        heading: "Types of Thyroid Cancer",
        content: "Papillary thyroid carcinoma (PTC) is the most common (80%), typically slow-growing with excellent 10-year survival exceeding 95%. Follicular thyroid carcinoma (FTC, 10–15%) is slightly more aggressive, tends to spread via blood to distant sites. Medullary thyroid carcinoma (MTC, 3–5%) arises from C cells producing calcitonin — may be familial. Anaplastic thyroid carcinoma (1%) is rare but highly aggressive and carries a poor prognosis."
      },
      {
        heading: "Symptoms and Presentation",
        content: "Thyroid cancer most commonly presents as a painless lump in the front of the neck. Most thyroid nodules are benign (95%), but evaluation is essential. Suspicious features include rapid growth, hard consistency, fixation to surrounding structures, hoarseness of voice (suggesting recurrent laryngeal nerve involvement), difficulty swallowing, and enlarged lymph nodes in the neck."
      },
      {
        heading: "Diagnosis",
        content: "Ultrasound is the first-line investigation for thyroid nodules and can identify suspicious features (irregular margins, microcalcifications, abnormal vascularity). Fine Needle Aspiration Cytology (FNAC) provides tissue diagnosis and is the key decision-making investigation. CT/MRI defines the extent of large tumours. Serum calcitonin is measured for suspected medullary carcinoma. Molecular testing of FNA samples helps further classify indeterminate nodules."
      },
      {
        heading: "Surgical Treatment: Thyroidectomy",
        content: "Thyroidectomy is the primary treatment for thyroid cancer. Total thyroidectomy removes the entire gland and is indicated for most thyroid cancers. Hemithyroidectomy (lobectomy) may be appropriate for low-risk papillary cancers confined to one lobe. Central neck dissection removes lymph nodes between the central compartment, while lateral neck dissection addresses nodes in the lateral compartments when involved."
      },
      {
        heading: "Protecting the Recurrent Laryngeal Nerve",
        content: "The recurrent laryngeal nerve (RLN) runs behind the thyroid and controls vocal cord movement. Injury leads to hoarseness. Identifying and preserving both RLNs is a core surgical objective. Intra-operative nerve monitoring provides continuous feedback to alert the surgeon to nerve proximity, significantly reducing the risk of injury. In experienced hands, RLN injury rates are below 1–2%."
      },
      {
        heading: "Post-Surgical Treatment and Follow-up",
        content: "After total thyroidectomy, thyroid hormone replacement (levothyroxine) is required lifelong. For differentiated thyroid cancers, radioactive iodine (RAI) ablation destroys residual thyroid tissue and any metastatic deposits. Long-term follow-up includes thyroglobulin monitoring and neck ultrasound to detect recurrence. The prognosis for well-differentiated thyroid cancer with appropriate treatment is excellent, with 10-year survival rates exceeding 95%."
      }
    ],
    whenToConsult: [
      "Painless lump in the front of the neck or lower throat",
      "Thyroid nodule found incidentally on ultrasound",
      "Hoarseness of voice associated with a thyroid swelling",
      "Difficulty swallowing or breathing with a growing neck mass",
      "Enlarged lymph nodes in the neck with or without thyroid symptoms",
      "Family history of thyroid cancer or MEN syndrome"
    ],
    treatment: [
      "Hemithyroidectomy: Removes one lobe — for low-risk confined papillary cancers",
      "Total thyroidectomy: Removes entire gland — standard for most thyroid cancers",
      "Central neck dissection: Removes central compartment lymph nodes",
      "Lateral neck dissection: For lateral compartment lymph node metastases",
      "Radioactive iodine (RAI) ablation: Post-surgical for differentiated thyroid cancers",
      "Thyroid hormone suppression therapy: Lifelong levothyroxine after thyroidectomy"
    ],
    faqs: [
      {
        question: "Is thyroid cancer curable?",
        answer: "Yes. Most thyroid cancers — particularly papillary and follicular types — are highly curable when properly managed. The 10-year survival rate for well-differentiated thyroid cancer exceeds 95%. Even thyroid cancers that have spread to neck lymph nodes are effectively managed with surgery and radioactive iodine. It is genuinely one of the most treatable cancers."
      },
      {
        question: "Will I need to take medicines lifelong after thyroid surgery?",
        answer: "Yes. After total thyroidectomy, the body no longer produces thyroid hormone, which is essential for metabolism, energy, and overall health. Lifelong thyroid hormone replacement (levothyroxine tablets) is required, typically taken once daily on an empty stomach. Dose is adjusted based on blood tests and is generally well tolerated."
      },
      {
        question: "Will my voice be affected after thyroid surgery?",
        answer: "Voice change is a potential risk because the recurrent laryngeal nerve (which controls the vocal cords) lies adjacent to the thyroid. With experienced surgeons using intra-operative nerve monitoring, the risk of permanent voice change is very low (less than 1–2%). Temporary hoarseness due to nerve handling may occur but usually resolves within weeks."
      },
      {
        question: "How will I know if the cancer comes back?",
        answer: "After total thyroidectomy and radioactive iodine treatment, follow-up includes regular blood tests for thyroglobulin (a marker produced by any remaining thyroid cells) and neck ultrasound. Rising thyroglobulin or suspicious nodes on ultrasound prompt further evaluation. Most recurrences are detected early and managed effectively with additional surgery or radioactive iodine."
      }
    ],
    related: [
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" },
      { slug: "skull-base-surgery", title: "Skull Base Surgery" },
      { slug: "types-of-treatment-for-head-and-neck-cancer", title: "Types of Treatment for Head and Neck Cancer" }
    ]
  },

  "skull-base-surgery": {
    title: "Skull Base Surgery",
    subtitle: "Advanced surgical access to tumours at the base of the skull — safely and precisely",
    overview: "The skull base is the bony floor of the skull, separating the brain from the face and neck. Tumours in this region are among the most complex in surgery because they sit adjacent to the brain, major blood vessels, and critical cranial nerves. Skull base surgery uses specialized approaches to safely access and remove these tumours. Endoscopic techniques through the nose have revolutionized this field, allowing complex surgery with minimal incisions and faster recovery.",
    keyPoints: [
      "Skull base tumours sit at the interface of brain, face, and neck structures",
      "Endoscopic endonasal (through the nose) approaches are now standard for many tumours",
      "Common skull base tumours include pituitary adenomas, meningiomas, and esthesioneuroblastomas",
      "Surgery is performed by a team including ENT/head-neck surgeon and neurosurgeon",
      "Preservation of cranial nerves — sight, hearing, facial movement, swallowing — is paramount",
      "Advanced navigation systems guide surgeons in real-time during complex cases"
    ],
    sections: [
      {
        heading: "What is the Skull Base?",
        content: "The skull base forms the floor of the cranial cavity and separates the brain above from the face and neck below. It contains openings through which cranial nerves and blood vessels pass. This region includes the anterior skull base (above the nose and orbits), central skull base (around the pituitary gland), and posterior skull base (behind, near the brainstem). Tumours can arise from any of these areas or extend from adjacent structures."
      },
      {
        heading: "Types of Skull Base Tumours",
        content: "Common skull base tumours include: pituitary adenomas (benign hormone-producing tumours), meningiomas (arising from the brain lining), esthesioneuroblastoma (from the olfactory nerve in the nasal cavity), sinonasal malignancies extending into the skull base, chordomas (from remnants of the embryonic notochord), acoustic neuromas (vestibular schwannomas affecting hearing), and paragangliomas (chemodectomas arising from chemoreceptor tissue)."
      },
      {
        heading: "Endoscopic Skull Base Surgery",
        content: "The endoscopic endonasal approach (EEA) uses a thin rigid telescope inserted through the nose, with high-definition cameras and specialized instruments. No external incisions are needed. The tumour is accessed and removed through natural nasal corridors, avoiding brain retraction. EEA is now the preferred approach for pituitary tumours, anterior skull base lesions, and select central skull base lesions, offering less pain, shorter hospital stay, and faster recovery compared to open approaches."
      },
      {
        heading: "Open Skull Base Approaches",
        content: "Complex tumours involving the lateral skull base, posterior fossa, or requiring vascular control may need open surgical approaches performed jointly with a neurosurgery team. These include craniofacial resection (for anterior skull base malignancies), lateral skull base approaches (for acoustic neuromas, jugular foramen tumours), and infratemporal fossa approaches. Modern navigation systems provide real-time 3D guidance during these intricate operations."
      },
      {
        heading: "Cranial Nerve Preservation",
        content: "Multiple cranial nerves pass through the skull base, governing vision, hearing, facial sensation and movement, eye movements, smell, and swallowing. Protecting these nerves is the primary surgical goal alongside tumour removal. Intra-operative monitoring of cranial nerve function alerts the surgical team in real-time. In some cases, complete nerve preservation is not possible if the nerve is encased by the tumour, requiring rehabilitation strategies post-operatively."
      },
      {
        heading: "Multidisciplinary Team Approach",
        content: "Skull base surgery requires a coordinated team — typically a head and neck surgical oncologist/ENT skull base surgeon working alongside a neurosurgeon. Neuroradiology, neuro-anaesthesia, ophthalmology, and endocrinology support are often involved depending on tumour location. This multidisciplinary approach, available at specialized centres, is essential for the safe management of these complex cases."
      }
    ],
    whenToConsult: [
      "Pituitary tumour with vision loss, hormonal disturbance, or headache",
      "Nasal mass with intracranial extension seen on imaging",
      "Progressive hearing loss with balance disturbance (acoustic neuroma)",
      "Facial numbness or weakness with a known skull base lesion",
      "Recurrent nosebleed with a nasal or skull base mass",
      "Any skull base tumour identified on CT or MRI"
    ],
    treatment: [
      "Endoscopic endonasal surgery: Minimally invasive removal of anterior and central skull base tumours",
      "Craniofacial resection: Open approach for malignant anterior skull base tumours",
      "Lateral skull base surgery: For posterior fossa and jugular foramen tumours",
      "Radiation (stereotactic radiosurgery, Gamma Knife): For small residual or recurrent benign tumours",
      "Adjuvant radiotherapy: Post-operative for malignant skull base tumours",
      "Cranial nerve monitoring: Intra-operative to maximize nerve preservation"
    ],
    faqs: [
      {
        question: "Is skull base surgery very risky?",
        answer: "Skull base surgery is complex, but significant advances in endoscopic techniques, intra-operative navigation, and cranial nerve monitoring have substantially improved safety. At specialized centres with experienced teams, outcomes for most skull base tumours are excellent. Risks depend on tumour type, size, and location, and will be discussed specifically at consultation."
      },
      {
        question: "Will I need a large incision or head shaving for skull base surgery?",
        answer: "Many skull base tumours — especially pituitary adenomas and anterior skull base lesions — are now removed entirely through the nose without any external incisions or head shaving. For tumours requiring an open approach, incisions are designed to minimize visible scarring. Your surgeon will discuss the specific approach planned for your case."
      },
      {
        question: "How long is the hospital stay after skull base surgery?",
        answer: "For endoscopic endonasal procedures, the hospital stay is typically 3–5 days. Open skull base operations may require 7–10 days, with some time in a neurosurgical ICU for monitoring. Recovery at home varies from a few weeks for endoscopic cases to 4–8 weeks for open procedures, depending on the extent of the surgery."
      },
      {
        question: "Does removing a skull base tumour cure the condition?",
        answer: "For many benign skull base tumours (pituitary adenomas, meningiomas, acoustic neuromas), complete surgical removal is curative or provides long-lasting control. For malignant skull base tumours, surgery combined with post-operative radiation achieves the best outcomes. Some tumours have a tendency to recur and require long-term surveillance. Your surgeon will discuss the expected outcomes for your specific tumour type."
      }
    ],
    related: [
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" },
      { slug: "minimally-invasive", title: "Minimally Invasive and Cosmetically Superior Surgeries" },
      { slug: "thyroid-cancer", title: "Thyroid Cancer" }
    ]
  },

  "minimally-invasive": {
    title: "Minimally Invasive and Cosmetically Superior Surgeries",
    subtitle: "Advanced surgical techniques that minimize scars, pain, and recovery time",
    overview: "Modern head and neck surgery increasingly uses minimally invasive approaches that achieve the same oncological results as traditional open surgery while dramatically reducing the impact on the patient. Endoscopic, robot-assisted, and video-assisted techniques allow surgeons to access tumours through small incisions or natural body orifices — reducing hospital stays, post-operative pain, recovery time, and cosmetic impact. These advances are transforming the patient experience without compromising cure rates.",
    keyPoints: [
      "Endoscopic surgery uses tiny cameras and instruments through small incisions or natural openings",
      "Robot-assisted surgery (TORS) enables complex throat and tongue base operations through the mouth",
      "Video-assisted thyroidectomy can leave no visible neck scar",
      "Remote-access approaches (axillary, retro-auricular) eliminate neck incisions for thyroid surgery",
      "Endoscopic skull base surgery accesses brain-adjacent tumours through the nose",
      "Laser microsurgery treats early laryngeal (voice box) cancer without open surgery"
    ],
    sections: [
      {
        heading: "Why Minimally Invasive?",
        content: "Traditional open surgery for head and neck tumours often requires long incisions in prominent, visible areas of the face and neck. Minimally invasive alternatives achieve equivalent surgical outcomes with smaller incisions or none at all — reducing scarring, pain, infection risk, and recovery time. For many patients, especially young adults and professionals, cosmetic outcomes and rapid return to work are important priorities alongside cancer cure."
      },
      {
        heading: "Trans-Oral Robotic Surgery (TORS)",
        content: "TORS uses a surgical robot with small arms inserted through the open mouth to operate on the oropharynx (base of tongue, tonsils, soft palate) and hypopharynx without any external incision. The robot's high-definition 3D vision and articulating instruments allow precise surgery in areas that are difficult to reach otherwise. TORS is particularly valuable for HPV-related oropharyngeal cancers and early-stage throat cancers."
      },
      {
        heading: "Endoscopic Thyroid and Parathyroid Surgery",
        content: "Video-assisted thyroidectomy uses small incisions near the collar bone or in the axilla (armpit) to remove the thyroid through a endoscope. Remote-access approaches include the bilateral axillo-breast approach (BABA) and retro-auricular approach, which leave the neck completely scar-free. These approaches are suitable for smaller thyroid nodules and selected cancers, offering excellent cosmetic outcomes especially for younger patients."
      },
      {
        heading: "Endoscopic and Laser Surgery for the Larynx",
        content: "Early cancers of the vocal cords (glottic carcinoma) can be treated using transoral laser microsurgery (TLM) — a laser delivered through a rigid laryngoscope destroys the cancer with pinpoint precision, preserving surrounding tissue and voice quality. No neck incision is needed. Results match external open surgery for early-stage disease with significantly faster recovery and better voice preservation."
      },
      {
        heading: "Endoscopic Skull Base Surgery",
        content: "As detailed in the skull base surgery section, endoscopic approaches through the nose now allow the removal of pituitary tumours, anterior skull base malignancies, and selected central skull base lesions without any external incision. High-definition 3D endoscopes, intra-operative navigation, and specially designed angled instruments have made this approach safe and effective."
      },
      {
        heading: "Who is Suitable for Minimally Invasive Surgery?",
        content: "Not every patient or tumour is suitable for a minimally invasive approach. Suitability depends on tumour size, location, extent, and the surgeon's training. Minimally invasive approaches are most appropriate for early-stage and confined tumours. Advanced or large tumours typically require open surgery for adequate access and margins. Your surgeon will recommend the approach best suited to your specific case."
      }
    ],
    whenToConsult: [
      "Thyroid nodule or cancer in a young patient concerned about neck scarring",
      "Early-stage oropharyngeal or laryngeal cancer",
      "Pituitary tumour suitable for endoscopic approach",
      "Parathyroid adenoma requiring surgery",
      "Request for second opinion on whether open surgery can be avoided",
      "Any head and neck surgical condition where cosmesis is a concern"
    ],
    treatment: [
      "Trans-oral robotic surgery (TORS): For oropharyngeal and selected tongue base cancers",
      "Video-assisted thyroidectomy: Small incisions or remote access for thyroid surgery",
      "Transoral laser microsurgery (TLM): For early vocal cord and laryngeal cancers",
      "Endoscopic endonasal surgery: Skull base and pituitary tumours through the nose",
      "Endoscopic neck dissection: Selected cases of lymph node dissection via small ports",
      "Laser ablation: For superficial precancerous and early lesions of the oral cavity"
    ],
    faqs: [
      {
        question: "Is minimally invasive surgery as safe as open surgery?",
        answer: "For appropriately selected patients and tumours, minimally invasive techniques achieve equivalent oncological outcomes to open surgery — the same cancer control rates — with reduced cosmetic impact, pain, and recovery time. Patient selection is key: not every case is suitable, and an experienced surgeon will recommend the approach most appropriate for your specific situation."
      },
      {
        question: "Will my cancer be completely removed with a minimally invasive approach?",
        answer: "The primary goal is always complete tumour removal with adequate margins, regardless of the approach used. Minimally invasive techniques are only used when achieving complete margins is feasible through the planned approach. If there is any concern about adequacy of removal, an open approach will be recommended to ensure cancer control."
      },
      {
        question: "Is robotic surgery available in India?",
        answer: "Trans-oral robotic surgery (TORS) is available at select specialized cancer centres in India. The da Vinci robotic system is increasingly used for head and neck surgery. Endoscopic and video-assisted techniques are more widely available. Ask your surgeon about whether these approaches are available and appropriate for your condition."
      },
      {
        question: "Is recovery really faster with minimally invasive surgery?",
        answer: "Yes. Minimally invasive procedures typically involve less post-operative pain, shorter hospital stays (often 1–2 days versus 5–7 for open surgery), and faster return to normal activities. Video-assisted thyroidectomy patients often return to normal activities within 1–2 weeks. TORS patients avoid the morbidity of open throat surgery and recover much faster."
      }
    ],
    related: [
      { slug: "skull-base-surgery", title: "Skull Base Surgery" },
      { slug: "thyroid-cancer", title: "Thyroid Cancer" },
      { slug: "laryngeal-and-hypopharyngeal-cancer", title: "Laryngeal and Hypopharyngeal Cancer" }
    ]
  },

  "laryngeal-and-hypopharyngeal-cancer": {
    title: "Laryngeal and Hypopharyngeal Cancer",
    subtitle: "Specialized surgical management with focus on voice and swallowing preservation",
    overview: "Laryngeal cancer (cancer of the voice box) and hypopharyngeal cancer (cancer of the lower throat behind the larynx) are significant head and neck malignancies. The larynx has three critical functions: breathing, voice production, and protecting the airway during swallowing. Treatment — whether surgery or radiation — must consider all three. Modern surgical approaches emphasize function preservation, using laser microsurgery for early cases and voice-preserving partial laryngectomy for selected advanced cases. Total laryngectomy, when required, is paired with voice rehabilitation strategies.",
    keyPoints: [
      "Hoarseness of voice lasting more than 3 weeks must be urgently evaluated",
      "Early-stage laryngeal cancer has cure rates exceeding 90%",
      "Laser microsurgery can treat early vocal cord cancer with excellent voice preservation",
      "Partial laryngectomy preserves breathing, swallowing, and some voice for selected cases",
      "Total laryngectomy results in permanent tracheostomy but voice can be restored",
      "Hypopharyngeal cancer is often advanced at diagnosis and requires multimodal treatment"
    ],
    sections: [
      {
        heading: "The Larynx and Hypopharynx",
        content: "The larynx (voice box) is in the midline of the neck and contains the vocal cords. It has three regions: supraglottis (above the cords), glottis (the cords themselves), and subglottis (below the cords). The hypopharynx is the lower part of the throat surrounding the larynx — the pyriform sinuses (the most common hypopharyngeal cancer site) and the posterior pharyngeal wall. Both are closely related anatomically and functionally."
      },
      {
        heading: "Symptoms and Warning Signs",
        content: "For laryngeal cancer: hoarseness of voice persisting more than 3 weeks is the hallmark symptom, especially for glottic (vocal cord) cancers where it occurs early. Other symptoms include sore throat, difficulty swallowing, pain referred to the ear, and breathing difficulty in advanced cases. For hypopharyngeal cancer: swallowing difficulty (dysphagia) and a sensation of a lump in the throat are common, but hoarseness may be absent in early stages — leading to later diagnosis. Neck lump from lymph node spread is often the presenting symptom."
      },
      {
        heading: "Diagnosis",
        content: "Laryngoscopy (flexible or rigid) provides direct visualization of the vocal cords and larynx and is the key diagnostic investigation. Any suspicious lesion requires biopsy under anaesthesia (direct laryngoscopy with biopsy). CT scan with contrast of the neck assesses the depth of tumour invasion, cartilage involvement, and lymph node disease. MRI provides additional soft tissue detail. PET-CT is used for advanced or suspected metastatic disease."
      },
      {
        heading: "Surgical Options for Laryngeal Cancer",
        content: "Early-stage (T1-T2) glottic cancer can be effectively treated with transoral laser microsurgery (TLM) — a CO2 laser vaporizes the tumour through a laryngoscope with excellent voice outcomes. Radiation therapy is an alternative for early stages. Partial laryngectomy (supraglottic, supracricoid approaches) preserves the larynx and some voice in selected T2-T3 cases. Total laryngectomy — removal of the entire larynx — is required for extensive T3-T4 disease, with permanent tracheostomy but achievable voice rehabilitation."
      },
      {
        heading: "Voice Rehabilitation After Total Laryngectomy",
        content: "After total laryngectomy, patients breathe through a permanent opening in the neck (tracheostomy). Voice rehabilitation options include: tracheoesophageal puncture (TEP) with a voice prosthesis — the most natural-sounding method, allowing patients to speak by covering the tracheostomy and directing air into the oesophagus; oesophageal speech — learned technique using swallowed air; and electronic larynx devices. With appropriate rehabilitation, most patients achieve intelligible and functional speech."
      },
      {
        heading: "Hypopharyngeal Cancer Treatment",
        content: "Hypopharyngeal cancers are often diagnosed at an advanced stage. Treatment is multimodal: surgery (partial or total pharyngolaryngectomy) combined with post-operative radiation, or definitive chemoradiation for organ preservation in selected cases. Reconstruction of the pharynx after surgery uses free flaps (radial forearm, free jejunum). Neck dissection is routinely performed due to high rates of lymph node metastasis. Prognosis depends on stage at diagnosis."
      }
    ],
    whenToConsult: [
      "Hoarseness of voice lasting more than 3 weeks",
      "Progressive difficulty swallowing, especially solid food",
      "Sensation of a lump or foreign body in the throat",
      "Persistent sore throat or pain radiating to the ear",
      "Breathing difficulty or noisy breathing (stridor)",
      "Neck lump with any of the above symptoms"
    ],
    treatment: [
      "Transoral laser microsurgery (TLM): For early-stage glottic and supraglottic cancer",
      "Radiation therapy: As primary treatment for early laryngeal cancer",
      "Partial laryngectomy: Voice and larynx preserving surgery for selected T2-T3 cases",
      "Total laryngectomy: For extensive laryngeal cancer — with voice rehabilitation",
      "Chemoradiation: Organ preservation protocol for selected advanced hypopharyngeal cancers",
      "Total pharyngolaryngectomy with free flap: For advanced hypopharyngeal cancer",
      "Neck dissection: Routine for N+ disease and high-risk cases"
    ],
    faqs: [
      {
        question: "Will I lose my voice permanently if I need larynx surgery?",
        answer: "Not necessarily. For early-stage cancers, laser microsurgery or partial laryngectomy preserves the larynx and voice quality is maintained or only slightly affected. Total laryngectomy is required for extensive disease, but modern voice rehabilitation options — especially tracheoesophageal voice prosthesis — allow most patients to speak effectively and communicate normally."
      },
      {
        question: "Can laryngeal cancer be treated without surgery?",
        answer: "Yes, for selected cases. Early-stage vocal cord cancer can be treated with radiation alone, achieving similar cure rates to laser surgery. For advanced laryngeal and hypopharyngeal cancers, concurrent chemoradiation (organ preservation protocol) is an established alternative to surgery that avoids laryngectomy in many patients. The choice depends on stage, tumour characteristics, patient factors, and institutional expertise."
      },
      {
        question: "How serious is hoarseness as a symptom?",
        answer: "Hoarseness lasting more than 3 weeks — particularly in a smoker or tobacco user — must be evaluated by an ENT specialist or head and neck surgeon. It may be caused by benign conditions (vocal cord polyp, laryngitis) but can also be the first sign of vocal cord cancer when cure rates are highest. Do not delay evaluation of persistent hoarseness."
      },
      {
        question: "What happens if I need a total laryngectomy — can I live a normal life?",
        answer: "Thousands of patients worldwide live full, active lives after total laryngectomy. Breathing through a neck stoma becomes routine. Voice is rehabilitated with a tracheoesophageal voice prosthesis or other methods. Eating is normal (the food passage is separate from the airway after laryngectomy). Activities including work, travel, and social engagement are all possible with appropriate support and rehabilitation."
      }
    ],
    related: [
      { slug: "head-and-neck-cancer", title: "Head and Neck Cancer" },
      { slug: "minimally-invasive", title: "Minimally Invasive and Cosmetically Superior Surgeries" },
      { slug: "types-of-treatment-for-head-and-neck-cancer", title: "Types of Treatment for Head and Neck Cancer" }
    ]
  }
};
