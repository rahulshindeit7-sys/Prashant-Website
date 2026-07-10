const fs = require('fs');
const c = JSON.parse(fs.readFileSync('config/doctor-profile.json', 'utf8'));

const content = {
  'head-and-neck-cancer': {
    overview: 'Head and neck cancers include cancers of the oral cavity, pharynx, larynx, nasal cavity, paranasal sinuses, and salivary glands. These cancers are among the most common in India, often linked to tobacco and alcohol use. Early detection and surgical intervention by a specialist head and neck oncosurgeon can significantly improve outcomes.',
    keyPoints: ['Includes oral, pharyngeal, laryngeal, sinonasal, and salivary gland cancers', 'Tobacco, alcohol, and HPV are major risk factors', 'Surgery is the primary treatment for most head and neck cancers', 'Multidisciplinary approach with radiation and chemotherapy when needed', 'Early-stage cancers have cure rates above 80%', 'Reconstruction surgery restores form and function after tumor removal'],
    whenToConsult: ['Non-healing ulcer or sore in the mouth lasting more than 2-3 weeks', 'Persistent lump or swelling in the neck', 'Difficulty swallowing or change in voice lasting more than 2 weeks', 'Unexplained bleeding from mouth, nose, or throat', 'White or red patches inside the mouth'],
    treatment: ['Surgical excision of tumor with adequate margins', 'Neck dissection for lymph node involvement', 'Microvascular free flap reconstruction', 'Post-operative radiation therapy if indicated', 'Chemotherapy for advanced stages']
  },
  'diagnosing-head-and-neck-cancer': {
    overview: 'Accurate diagnosis of head and neck cancers involves clinical examination, imaging studies, and tissue biopsy. Early diagnosis is critical for better treatment outcomes and preserving function.',
    keyPoints: ['Clinical examination of oral cavity, neck, and throat', 'Biopsy (incisional or punch) confirms cancer type and grade', 'CT scan and MRI for tumor extent and staging', 'PET-CT for detecting distant metastasis', 'Fine needle aspiration (FNAC) for neck lumps', 'TNM staging guides treatment planning'],
    whenToConsult: ['Any lump or swelling in the neck persisting more than 2 weeks', 'Non-healing mouth ulcer or growth', 'Unexplained weight loss with throat symptoms', 'Difficulty opening the mouth (trismus)', 'Numbness or tingling in face or tongue'],
    treatment: ['Incisional biopsy under local anesthesia', 'FNAC for neck nodes', 'Imaging: CT, MRI, PET-CT as needed', 'Panendoscopy for assessment', 'Multidisciplinary tumor board discussion']
  },
  'types-of-treatment-for-head-and-neck-cancer': {
    overview: 'Treatment of head and neck cancer depends on the site, stage, and patient factors. Options include surgery, radiation therapy, chemotherapy, immunotherapy, and targeted therapy. A multimodality approach is often needed for advanced cancers.',
    keyPoints: ['Surgery is the mainstay for resectable tumors', 'Radiation therapy as primary treatment or post-operative adjuvant', 'Chemotherapy combined with radiation for advanced stages', 'Immunotherapy for recurrent or metastatic cancers', 'Targeted therapy for specific molecular profiles', 'Rehabilitation includes speech therapy and swallowing therapy'],
    whenToConsult: ['After confirmed diagnosis of head and neck cancer', 'For second opinion on treatment plan', 'When current treatment is not showing response', 'For reconstruction planning after cancer surgery', 'For voice rehabilitation after laryngectomy'],
    treatment: ['Primary surgical excision', 'Adjuvant radiation therapy (IMRT/IGRT)', 'Concurrent chemoradiation', 'Immunotherapy (Pembrolizumab, Nivolumab)', 'Palliative care for advanced disease']
  },
  'how-cancer-spreads-in-the-body': {
    overview: 'Cancer spreads (metastasizes) through direct extension into adjacent tissues, lymphatic spread to regional lymph nodes, and hematogenous (blood) spread to distant organs. Understanding spread patterns helps in staging and treatment planning.',
    keyPoints: ['Direct extension: tumor grows into adjacent structures', 'Lymphatic spread: cancer cells travel to lymph nodes in the neck', 'Hematogenous spread: cancer reaches lungs, bones, liver through blood', 'Perineural invasion: cancer spreads along nerve pathways', 'Staging (TNM) assesses the extent of spread', 'Early detection prevents metastatic disease'],
    whenToConsult: ['When diagnosed with any cancer for staging workup', 'New lump in neck after cancer treatment', 'Persistent pain in bones or unexplained weight loss', 'Follow-up surveillance after cancer treatment', 'Before starting any cancer treatment for complete staging'],
    treatment: ['Complete surgical removal with clear margins', 'Neck dissection for lymph node metastasis', 'Adjuvant radiation or chemoradiation', 'Systemic chemotherapy for distant metastasis', 'Regular follow-up imaging']
  },
  'oral-precancerous-lesions-and-treatment': {
    overview: 'Oral precancerous lesions include leukoplakia, erythroplakia, and oral submucous fibrosis (OSMF). These conditions have potential to transform into oral cancer if left untreated. Early intervention can prevent malignant transformation.',
    keyPoints: ['Leukoplakia: white patches that cannot be wiped off', 'Erythroplakia: red patches with higher malignant potential', 'Oral submucous fibrosis: progressive fibrosis causing restricted mouth opening', 'Tobacco and betel nut are primary causes', 'Malignant transformation rate varies from 1% to 50% depending on type', 'Regular biopsy and follow-up is essential'],
    whenToConsult: ['White or red patch inside mouth lasting more than 2 weeks', 'Difficulty opening the mouth fully', 'Burning sensation while eating spicy food', 'Any change in size, color, or texture of existing patch', 'Tobacco users with any oral symptoms'],
    treatment: ['Habit cessation (tobacco, betel nut, alcohol)', 'Medical management with antioxidants and supplements', 'Laser excision of leukoplakia', 'Surgical release of fibrosis bands in OSMF', 'Regular follow-up with biopsy if changes occur']
  },
  'oral-cancer-in-india': {
    overview: 'India has one of the highest rates of oral cancer globally, accounting for nearly one-third of all cancers in the country. Tobacco chewing, betel nut, smoking, and alcohol are major risk factors unique to the Indian population.',
    keyPoints: ['India accounts for 30% of global oral cancer cases', 'Most common cancer in Indian males', 'Average age of presentation is 40-50 years', 'Tobacco chewing (gutka, khaini, paan) is the leading cause', 'Late presentation is common due to lack of awareness', 'Early detection through screening can save lives'],
    whenToConsult: ['Any non-healing ulcer in the mouth', 'Difficulty in chewing or swallowing', 'Loosening of teeth without dental cause', 'Swelling or lump on jaw or neck', 'Change in voice or persistent sore throat'],
    treatment: ['Surgery for early and locally advanced cancers', 'Reconstruction for functional rehabilitation', 'Radiation and chemotherapy for advanced stages', 'Screening programs for high-risk populations', 'Public awareness and tobacco cessation programs']
  },
  'oral-cancer-overview': {
    overview: 'Oral cancer affects the lips, tongue, cheeks, floor of mouth, hard palate, and gums. It is one of the most common cancers in India. With early diagnosis and expert surgical treatment, cure rates are high.',
    keyPoints: ['Tongue cancer is the most common subsite', 'Buccal mucosa (cheek) cancer is common in tobacco chewers', 'TNM staging determines treatment approach', 'Surgery with clear margins is the gold standard', 'Reconstruction preserves speech and swallowing', '5-year survival rate for early-stage is above 70%'],
    whenToConsult: ['Non-healing ulcer or growth in the mouth', 'Pain while chewing or swallowing', 'Numbness of lip, chin, or tongue', 'Bleeding from the mouth', 'Lump or thickening in cheek or neck'],
    treatment: ['Wide local excision of tumor', 'Partial or total glossectomy for tongue cancers', 'Mandibulectomy if jaw is involved', 'Neck dissection', 'Microvascular free flap reconstruction']
  },
  'human-papilloma-virus-and-oral-cancer': {
    overview: 'Human Papillomavirus (HPV), particularly HPV-16, is an emerging risk factor for oropharyngeal cancers (tonsil and base of tongue). HPV-related cancers tend to occur in younger patients and generally have better prognosis than tobacco-related cancers.',
    keyPoints: ['HPV-16 is the most common type associated with oropharyngeal cancer', 'Affects tonsil and base of tongue primarily', 'Often presents as neck lump in younger patients', 'Better response to treatment compared to HPV-negative cancers', 'HPV vaccination can prevent these cancers', 'p16 immunohistochemistry is used for detection'],
    whenToConsult: ['Persistent sore throat lasting more than 3 weeks', 'Painless neck lump in a young adult', 'Difficulty swallowing or ear pain on one side', 'Unexplained weight loss with throat symptoms', 'For HPV vaccination counseling'],
    treatment: ['Surgery (transoral robotic surgery) for early stages', 'Radiation therapy with or without chemotherapy', 'De-escalation protocols being studied for HPV-positive cancers', 'Neck dissection if needed', 'HPV vaccination for prevention']
  },
  'reconstruction-or-plastic-surgery-for-head-neck-cancer': {
    overview: 'Reconstruction after head and neck cancer surgery aims to restore form and function. Modern microvascular free flap techniques allow reconstruction of complex defects, enabling patients to eat, speak, and live with dignity after cancer treatment.',
    keyPoints: ['Microvascular free flaps are the gold standard', 'Radial forearm flap for tongue and floor of mouth', 'Fibula flap for jaw (mandible) reconstruction', 'ALT flap for large soft tissue defects', 'Pectoralis major flap as a workhorse pedicled flap', 'Goal: restore speech, swallowing, and cosmesis'],
    whenToConsult: ['After diagnosis when surgery will create a large defect', 'For jaw reconstruction planning', 'When previous surgery left functional deficit', 'For cosmetic improvement after cancer treatment', 'Speech or swallowing difficulty after surgery'],
    treatment: ['Microvascular free flap reconstruction', 'Pedicled flap options (pectoralis major, deltopectoral)', 'Bone reconstruction with fibula or scapula flap', 'Dental rehabilitation with implants', 'Speech and swallowing therapy post-reconstruction']
  },
  'salivary-glands-and-tumours-of-salivary-gland': {
    overview: 'Salivary gland tumors can arise in the parotid, submandibular, or minor salivary glands. Most parotid tumors are benign (pleomorphic adenoma), but malignant tumors require complete surgical excision with careful preservation of the facial nerve.',
    keyPoints: ['Parotid gland tumors are the most common', '80% of parotid tumors are benign', 'Pleomorphic adenoma is the most common benign tumor', 'Mucoepidermoid carcinoma is the most common malignant tumor', 'FNAC helps in preoperative diagnosis', 'Facial nerve preservation is critical during surgery'],
    whenToConsult: ['Painless swelling near ear or under jaw', 'Rapidly growing lump in front of ear', 'Facial weakness or numbness with a salivary gland lump', 'Pain or fixity of a salivary gland mass', 'Recurrent salivary gland swelling'],
    treatment: ['Superficial parotidectomy for benign tumors', 'Total parotidectomy with nerve preservation for malignant tumors', 'Submandibular gland excision', 'Neck dissection if lymph nodes involved', 'Post-operative radiation for high-grade malignancies']
  },
  'parotid-surgery': {
    overview: 'Parotid surgery involves removal of tumors from the parotid gland while preserving the facial nerve that runs through it. Expert surgical technique is essential to avoid facial paralysis and ensure complete tumor removal.',
    keyPoints: ['Facial nerve identification and preservation is paramount', 'Superficial parotidectomy for tumors in superficial lobe', 'Total parotidectomy for deep lobe tumors', 'Nerve monitoring may be used during surgery', 'Risk of Frey syndrome (gustatory sweating) post-surgery', 'Minimal scarring with modified Blair incision'],
    whenToConsult: ['Lump in front of or below the ear', 'Growing swelling in the parotid region', 'Facial weakness associated with parotid swelling', 'Recurrent parotid tumor after previous surgery', 'Pain or rapid growth of existing lump'],
    treatment: ['Superficial parotidectomy with nerve preservation', 'Total parotidectomy for deep lobe tumors', 'Nerve grafting if sacrifice is necessary', 'Adjuvant radiation for malignant tumors', 'Regular follow-up with MRI']
  },
  'what-is-cancer': {
    overview: 'Cancer is the uncontrolled growth of abnormal cells in the body. In oral cancer, cells in the mouth or throat grow out of control, forming tumors that can invade surrounding tissues and spread to other parts of the body.',
    keyPoints: ['Cancer occurs when normal cell growth regulation fails', 'Mutations in DNA cause cells to divide uncontrollably', 'Benign tumors do not spread; malignant tumors (cancer) can spread', 'Risk factors include tobacco, alcohol, UV exposure, and genetic predisposition', 'Early symptoms: non-healing sore, lump, unexplained bleeding', 'Early detection dramatically improves survival rates'],
    whenToConsult: ['Any lump or swelling that persists for more than 2 weeks', 'Non-healing wound or ulcer', 'Unexplained weight loss', 'Persistent pain without clear cause', 'Change in a mole or skin lesion', 'Difficulty swallowing or breathing'],
    treatment: ['Surgery to remove the tumor', 'Radiation therapy', 'Chemotherapy', 'Immunotherapy', 'Targeted therapy', 'Combination treatments based on staging']
  },
  'why-oral-cancer': {
    overview: 'While tobacco and alcohol are the most common causes, oral cancer can also occur in people who have never used these substances. Other risk factors include HPV infection, genetic predisposition, chronic irritation, nutritional deficiencies, and immune suppression.',
    keyPoints: ['HPV infection (especially HPV-16) is an emerging cause', 'Genetic mutations can predispose to cancer without external risk factors', 'Chronic dental irritation from sharp teeth or ill-fitting dentures', 'Nutritional deficiency (iron, vitamin A) may increase risk', 'Immune suppression (HIV, organ transplant patients)', 'Betel nut chewing without tobacco is also a risk factor'],
    whenToConsult: ['Non-healing oral ulcer even without tobacco history', 'Family history of oral or head and neck cancer', 'Persistent oral symptoms without obvious cause', 'HPV-positive diagnosis with oropharyngeal symptoms', 'Any suspicious oral lesion regardless of habits'],
    treatment: ['Same treatment principles as tobacco-related cancers', 'Surgery with clear margins', 'HPV-related cancers may have different protocols', 'Genetic counseling for familial cases', 'Regular screening for high-risk individuals']
  },
  'thyroid-cancer': {
    overview: 'Thyroid cancer is a common endocrine malignancy that typically presents as a neck lump. Most thyroid cancers (papillary and follicular) have excellent prognosis with appropriate surgery. Expert surgical technique preserves the recurrent laryngeal nerve and parathyroid glands.',
    keyPoints: ['Papillary thyroid cancer is the most common type (80%)', 'Usually presents as a painless thyroid nodule', 'Ultrasound and FNAC are key diagnostic tools', 'Surgery (thyroidectomy) is the primary treatment', 'Radioactive iodine therapy for certain cases post-surgery', 'Excellent prognosis: 5-year survival above 95% for papillary type'],
    whenToConsult: ['Neck swelling or lump in the thyroid area', 'Hoarseness of voice with thyroid nodule', 'Rapidly growing thyroid nodule', 'Family history of thyroid cancer or MEN syndrome', 'Thyroid nodule with suspicious ultrasound features'],
    treatment: ['Hemithyroidectomy for small, low-risk cancers', 'Total thyroidectomy for larger or bilateral tumors', 'Central neck dissection if lymph nodes involved', 'Radioactive iodine ablation post-surgery', 'TSH suppression with levothyroxine']
  },
  'skull-base-surgery': {
    overview: 'Skull base surgery involves removal of tumors at the junction of the skull and face/neck. These complex procedures require expertise in both open craniofacial approaches and endoscopic techniques. Tumors include sinonasal cancers, esthesioneuroblastoma, and invading head and neck cancers.',
    keyPoints: ['Open craniofacial resection for anterior skull base tumors', 'Endoscopic endonasal approaches for select tumors', 'Multidisciplinary team with neurosurgeon often required', 'Sinonasal cancers and esthesioneuroblastoma are common indications', 'CSF leak prevention and management is critical', 'Advanced imaging (CT + MRI) for surgical planning'],
    whenToConsult: ['Nasal obstruction with bloody discharge', 'Loss of smell or facial pain', 'Tumor involving the paranasal sinuses extending to skull base', 'Double vision or eye displacement', 'Recurrent sinonasal polyps with suspicious features'],
    treatment: ['Open craniofacial resection', 'Endoscopic skull base surgery', 'Combined open + endoscopic approaches', 'Post-operative radiation therapy', 'Reconstruction of skull base defects']
  },
  'minimally-invasive': {
    overview: 'Minimally invasive and cosmetically superior surgeries use endoscopic and robotic techniques to achieve cancer cure with better cosmetic outcomes. These include scarless thyroid surgery, endoscopic neck dissection, and transoral approaches.',
    keyPoints: ['Endoscopic thyroidectomy (scarless neck surgery)', 'Robotic transoral surgery (TORS) for oropharyngeal cancers', 'Endoscopic submandibular gland excision', 'Endoscopic-assisted neck dissection', 'Smaller incisions, less scarring, faster recovery', 'Same oncologic outcomes as traditional surgery'],
    whenToConsult: ['Thyroid nodule requiring surgery (cosmetic concern)', 'Small oropharyngeal tumor suitable for TORS', 'Submandibular gland pathology', 'Patient preference for minimal scarring', 'Suitable tumor size and location for minimally invasive approach'],
    treatment: ['Endoscopic thyroidectomy via axillary or retroauricular approach', 'Transoral robotic surgery', 'Endoscopic neck dissection', 'Laser excision of laryngeal lesions', 'Natural orifice approaches when feasible']
  },
  'laryngeal-and-hypopharyngeal-cancer': {
    overview: 'Laryngeal (voice box) and hypopharyngeal cancers affect speech, breathing, and swallowing. Treatment aims to cure cancer while preserving or rehabilitating voice function. Options range from laser surgery for early cancers to total laryngectomy with voice prosthesis for advanced cases.',
    keyPoints: ['Hoarseness is the earliest symptom of laryngeal cancer', 'Smoking and alcohol are primary risk factors', 'Early glottic cancers have 90%+ cure rate with radiation or laser', 'Advanced cancers may require total laryngectomy', 'Voice rehabilitation with tracheoesophageal prosthesis', 'Dr. Prashant has patent on novel voice prosthesis device'],
    whenToConsult: ['Hoarseness lasting more than 3 weeks', 'Difficulty breathing or noisy breathing', 'Difficulty swallowing or sensation of lump in throat', 'Ear pain with voice change', 'Neck lump with voice or swallowing symptoms'],
    treatment: ['Laser excision for early laryngeal cancers', 'Radiation therapy for early-stage disease', 'Partial laryngectomy (voice preservation)', 'Total laryngectomy for advanced cancers', 'Tracheoesophageal puncture for voice rehabilitation']
  }
};

// Update expertise array with real content
c.expertise.forEach(item => {
  const data = content[item.slug];
  if (data && (!item.keyPoints || item.keyPoints.length === 0)) {
    item.overview = data.overview;
    item.keyPoints = data.keyPoints;
    item.whenToConsult = data.whenToConsult;
    item.treatment = data.treatment;
    // Also update summary for card display
    item.summary = data.overview.substring(0, 120) + '...';
  }
});

fs.writeFileSync('config/doctor-profile.json', JSON.stringify(c, null, 2));
console.log('EXPERTISE CONTENT POPULATED');
const filled = c.expertise.filter(e => (e.keyPoints || []).length > 0).length;
console.log('Items with content:', filled, '/', c.expertise.length);
