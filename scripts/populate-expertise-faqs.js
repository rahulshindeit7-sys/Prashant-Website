const fs = require('fs');
const c = JSON.parse(fs.readFileSync('config/doctor-profile.json', 'utf8'));

const faqs = {
  'head-and-neck-cancer': [
    { q: 'What are the early signs of head and neck cancer?', a: 'Non-healing mouth ulcer, persistent lump in neck, difficulty swallowing, voice change, or unexplained bleeding from mouth or nose lasting more than 2-3 weeks.' },
    { q: 'Is head and neck cancer curable?', a: 'Yes, when detected early, cure rates are above 80%. Even advanced cases can be effectively treated with surgery, radiation, and chemotherapy.' },
    { q: 'What causes head and neck cancer?', a: 'Tobacco (chewing and smoking), alcohol, betel nut use, HPV infection, and chronic irritation are the most common causes.' }
  ],
  'diagnosing-head-and-neck-cancer': [
    { q: 'How is head and neck cancer diagnosed?', a: 'Through clinical examination, biopsy of the lesion, imaging (CT/MRI/PET-CT), and FNAC of neck lumps. Biopsy is the gold standard for confirmation.' },
    { q: 'Is biopsy painful?', a: 'Biopsy is done under local anesthesia and causes minimal discomfort. Results are typically available within 3-5 days.' },
    { q: 'What scans are needed for cancer staging?', a: 'CT scan of head, neck and chest, MRI for soft tissue detail, and PET-CT for detecting distant spread are commonly used.' }
  ],
  'types-of-treatment-for-head-and-neck-cancer': [
    { q: 'What is the best treatment for head and neck cancer?', a: 'Treatment depends on cancer type, stage, and location. Surgery is preferred for resectable tumors, with radiation/chemotherapy as adjuvant or for non-surgical candidates.' },
    { q: 'Does radiation therapy have side effects?', a: 'Common side effects include dry mouth, difficulty swallowing, taste changes, and skin irritation. Most improve after treatment completion.' },
    { q: 'Can cancer be treated without surgery?', a: 'Early laryngeal and some oropharyngeal cancers can be treated with radiation alone. However, surgery offers best results for most oral cancers.' }
  ],
  'how-cancer-spreads-in-the-body': [
    { q: 'How does oral cancer spread?', a: 'Oral cancer spreads first to nearby lymph nodes in the neck, then can spread to lungs, bones, and liver through blood. Local spread to adjacent tissues also occurs.' },
    { q: 'Can cancer spread be prevented?', a: 'Early detection and complete surgical removal with clear margins is the best way to prevent spread. Regular follow-up detects recurrence early.' },
    { q: 'What is staging in cancer?', a: 'Staging (TNM system) assesses tumor size (T), lymph node involvement (N), and distant metastasis (M) to determine cancer extent and guide treatment.' }
  ],
  'oral-precancerous-lesions-and-treatment': [
    { q: 'Can leukoplakia turn into cancer?', a: 'Yes, leukoplakia has 1-20% malignant transformation rate. Erythroplakia has even higher risk (up to 50%). Regular monitoring and biopsy are essential.' },
    { q: 'How is oral submucous fibrosis treated?', a: 'Treatment includes strict cessation of betel nut/tobacco, medications, physiotherapy for mouth opening, and surgical release of fibrotic bands in severe cases.' },
    { q: 'Should I get a biopsy for a white patch in my mouth?', a: 'Yes, any white or red patch lasting more than 2 weeks should be evaluated. Biopsy helps determine if it is precancerous and guides treatment.' }
  ],
  'oral-cancer-in-india': [
    { q: 'Why is oral cancer so common in India?', a: 'High prevalence of tobacco chewing (gutka, paan, khaini), betel nut use, smoking, and alcohol consumption. Late presentation due to lack of awareness also contributes.' },
    { q: 'At what age does oral cancer occur?', a: 'In India, oral cancer commonly presents between 40-50 years, but increasingly seen in younger patients (30-40 years) due to gutka and tobacco use.' },
    { q: 'Can oral cancer be prevented?', a: 'Yes, by avoiding tobacco in all forms, limiting alcohol, maintaining good oral hygiene, and getting regular dental check-ups. Early detection through screening saves lives.' }
  ],
  'oral-cancer-overview': [
    { q: 'What are the types of oral cancer?', a: 'Oral cancer includes tongue cancer, buccal mucosa (cheek) cancer, lip cancer, floor of mouth cancer, gum cancer, and hard palate cancer. Tongue is the most common site.' },
    { q: 'What is the survival rate of oral cancer?', a: 'Early-stage oral cancer has 70-90% five-year survival rate. Advanced stages have 30-50% survival. Early detection is crucial for better outcomes.' },
    { q: 'How is oral cancer surgery performed?', a: 'Tumor is removed with adequate margins, neck dissection is done if needed, and reconstruction with flaps restores form and function for eating and speaking.' }
  ],
  'human-papilloma-virus-and-oral-cancer': [
    { q: 'Can HPV cause mouth cancer?', a: 'Yes, HPV-16 causes oropharyngeal cancer (tonsil and base of tongue). It accounts for 25-30% of oropharyngeal cancers and is increasing in prevalence.' },
    { q: 'Does HPV vaccination prevent oral cancer?', a: 'Yes, HPV vaccination (given before age 26) significantly reduces the risk of HPV-related oropharyngeal cancers.' },
    { q: 'Is HPV-related cancer different from tobacco-related cancer?', a: 'Yes, HPV-related cancers typically occur in younger patients, have better prognosis, and respond better to treatment compared to tobacco-related cancers.' }
  ],
  'reconstruction-or-plastic-surgery-for-head-neck-cancer': [
    { q: 'Will I look normal after cancer surgery?', a: 'Modern reconstruction techniques using microvascular free flaps restore facial appearance significantly. The goal is to maintain both function and cosmesis.' },
    { q: 'Can I eat and speak normally after jaw reconstruction?', a: 'Yes, fibula flap reconstruction of the jaw followed by dental implants allows near-normal eating. Speech therapy helps regain clear speech.' },
    { q: 'What is a free flap surgery?', a: 'A free flap involves transferring tissue (skin, muscle, bone) from another body part with its blood vessels, reconnected under microscope at the defect site.' }
  ],
  'salivary-glands-and-tumours-of-salivary-gland': [
    { q: 'Is a lump near the ear always cancer?', a: 'No, 80% of parotid tumors are benign. However, any persistent lump should be evaluated with FNAC and imaging to rule out malignancy.' },
    { q: 'What happens if salivary gland tumor is not treated?', a: 'Benign tumors can grow large and rarely transform to cancer (carcinoma ex pleomorphic adenoma). Malignant tumors can spread to neck nodes and beyond.' },
    { q: 'Will my face be affected after parotid surgery?', a: 'Expert surgeons preserve the facial nerve during parotid surgery. Temporary weakness may occur but permanent damage is rare with experienced surgeons.' }
  ],
  'parotid-surgery': [
    { q: 'Is parotid surgery safe?', a: 'Yes, with an experienced head and neck surgeon. The key risk is facial nerve injury, which is minimized with expert technique and nerve monitoring.' },
    { q: 'How long is recovery after parotid surgery?', a: 'Most patients go home in 2-3 days. Swelling resolves in 2-3 weeks. Full recovery takes 4-6 weeks. Facial nerve function recovers within weeks if temporarily affected.' },
    { q: 'Will there be a visible scar?', a: 'The incision is placed in a natural skin crease (modified Blair incision) in front of the ear, making it minimally visible after healing.' }
  ],
  'what-is-cancer': [
    { q: 'What is the difference between benign and malignant tumors?', a: 'Benign tumors grow slowly, do not spread, and are usually harmless. Malignant tumors (cancer) grow rapidly, invade surrounding tissues, and can spread to distant organs.' },
    { q: 'Is cancer hereditary?', a: 'Some cancers have genetic component, but most head and neck cancers are caused by environmental factors like tobacco and alcohol rather than heredity.' },
    { q: 'Can cancer come back after treatment?', a: 'Yes, recurrence is possible. Regular follow-up with clinical examination and imaging for 5 years after treatment helps detect recurrence early.' }
  ],
  'why-oral-cancer': [
    { q: 'Can non-smokers get oral cancer?', a: 'Yes, though less common. HPV infection, genetic factors, chronic irritation, nutritional deficiencies, and betel nut chewing without tobacco can cause oral cancer.' },
    { q: 'Does stress cause cancer?', a: 'Stress alone does not directly cause cancer, but chronic stress may weaken the immune system. Maintaining healthy lifestyle and regular check-ups is recommended.' },
    { q: 'Are young people at risk for oral cancer?', a: 'Yes, increasingly younger patients (25-40 years) are being diagnosed, often due to gutka/tobacco habits started early or HPV-related cancers.' }
  ],
  'thyroid-cancer': [
    { q: 'Is thyroid cancer serious?', a: 'Most thyroid cancers (papillary type) have excellent prognosis with 95%+ five-year survival. However, timely surgery is important to prevent spread.' },
    { q: 'Will I need lifelong medication after thyroid surgery?', a: 'If total thyroidectomy is done, lifelong thyroid hormone (levothyroxine) replacement is needed. After hemithyroidectomy, the remaining lobe usually maintains function.' },
    { q: 'How is thyroid cancer detected?', a: 'Through neck ultrasound showing suspicious nodule features, followed by Fine Needle Aspiration Cytology (FNAC) which confirms the diagnosis.' }
  ],
  'skull-base-surgery': [
    { q: 'What tumors need skull base surgery?', a: 'Sinonasal cancers, esthesioneuroblastoma, chordoma, meningioma extending to skull base, and locally advanced cancers invading the skull base.' },
    { q: 'Is skull base surgery dangerous?', a: 'It is complex but safe in experienced hands. Risks include CSF leak, infection, and cranial nerve damage, which are minimized with expert technique.' },
    { q: 'Can skull base tumors be removed endoscopically?', a: 'Select tumors can be removed through the nose (endoscopic endonasal approach) without external incisions, offering faster recovery.' }
  ],
  'minimally-invasive': [
    { q: 'What is scarless thyroid surgery?', a: 'Endoscopic thyroidectomy through axillary (armpit) or retroauricular (behind ear) approach leaves no visible neck scar while achieving the same oncologic result.' },
    { q: 'Is robotic surgery available for mouth cancer?', a: 'Yes, Transoral Robotic Surgery (TORS) is used for selected oropharyngeal cancers, offering precise removal through the mouth without external cuts.' },
    { q: 'Who is a good candidate for minimally invasive surgery?', a: 'Patients with small-to-moderate tumors in accessible locations, good general health, and preference for cosmetic outcome are ideal candidates.' }
  ],
  'laryngeal-and-hypopharyngeal-cancer': [
    { q: 'Will I lose my voice after larynx cancer treatment?', a: 'Not necessarily. Early cancers can be cured with laser or radiation preserving voice. Even after total laryngectomy, voice rehabilitation with prosthesis is possible.' },
    { q: 'What is a voice prosthesis?', a: 'A small valve placed between windpipe and food pipe that allows speech after laryngectomy. Dr. Prashant holds a patent on a novel tracheoesophageal voice prosthesis device.' },
    { q: 'Can larynx cancer be detected early?', a: 'Yes, any hoarseness lasting more than 3 weeks should be evaluated with laryngoscopy. Early glottic cancers have 90%+ cure rate.' }
  ]
};

// Add FAQs to expertise items
c.expertise.forEach(item => {
  const faqData = faqs[item.slug];
  if (faqData) {
    item.faqs = faqData.map(f => ({ question: f.q, answer: f.a }));
  }
});

fs.writeFileSync('config/doctor-profile.json', JSON.stringify(c, null, 2));
const filled = c.expertise.filter(e => (e.faqs || []).length > 0).length;
console.log(`FAQS ADDED: ${filled}/${c.expertise.length} expertise items now have FAQs`);
