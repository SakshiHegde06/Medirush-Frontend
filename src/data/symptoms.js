export const SYMPTOMS = [
  { id: 's1', name: 'Fever', icon: '🌡️', category: 'General' },
  { id: 's2', name: 'Headache', icon: '🤕', category: 'Neurological' },
  { id: 's3', name: 'Nausea', icon: '🤢', category: 'Digestive' },
  { id: 's4', name: 'Vomiting', icon: '🤮', category: 'Digestive' },
  { id: 's5', name: 'Stomach Pain', icon: '🫁', category: 'Digestive' },
  { id: 's6', name: 'Diarrhea', icon: '💧', category: 'Digestive' },
  { id: 's7', name: 'Chest Pain', icon: '💔', category: 'Cardiovascular' },
  { id: 's8', name: 'Shortness of Breath', icon: '🫁', category: 'Respiratory' },
  { id: 's9', name: 'Cough', icon: '😮‍💨', category: 'Respiratory' },
  { id: 's10', name: 'Sore Throat', icon: '🗣️', category: 'Respiratory' },
  { id: 's11', name: 'Runny Nose', icon: '👃', category: 'Respiratory' },
  { id: 's12', name: 'Fatigue', icon: '😴', category: 'General' },
  { id: 's13', name: 'Dizziness', icon: '😵', category: 'Neurological' },
  { id: 's14', name: 'Body Aches', icon: '🦴', category: 'Musculoskeletal' },
  { id: 's15', name: 'Rash', icon: '🔴', category: 'Skin' },
  { id: 's16', name: 'Itching', icon: '😣', category: 'Skin' },
  { id: 's17', name: 'Joint Pain', icon: '🦵', category: 'Musculoskeletal' },
  { id: 's18', name: 'Back Pain', icon: '🫶', category: 'Musculoskeletal' },
  { id: 's19', name: 'High Blood Pressure', icon: '❤️', category: 'Cardiovascular' },
  { id: 's20', name: 'Palpitations', icon: '💓', category: 'Cardiovascular' },
  { id: 's21', name: 'Swelling', icon: '🦶', category: 'General' },
  { id: 's22', name: 'Loss of Appetite', icon: '🍽️', category: 'Digestive' },
  { id: 's23', name: 'Weight Loss', icon: '⚖️', category: 'General' },
  { id: 's24', name: 'Night Sweats', icon: '🌙', category: 'General' },
  { id: 's25', name: 'Chills', icon: '🥶', category: 'General' },
  { id: 's26', name: 'Blurred Vision', icon: '👁️', category: 'Neurological' },
  { id: 's27', name: 'Eye Redness', icon: '😡', category: 'Neurological' },
  { id: 's28', name: 'Ear Pain', icon: '👂', category: 'Neurological' },
  { id: 's29', name: 'Difficulty Swallowing', icon: '😮', category: 'Digestive' },
  { id: 's30', name: 'Numbness', icon: '🖐️', category: 'Neurological' },
  { id: 's31', name: 'Muscle Weakness', icon: '💪', category: 'Musculoskeletal' },
  { id: 's32', name: 'Frequent Urination', icon: '🚽', category: 'Urological' },
  { id: 's33', name: 'Burning Urination', icon: '🔥', category: 'Urological' },
  { id: 's34', name: 'Abdominal Bloating', icon: '🫃', category: 'Digestive' },
  { id: 's35', name: 'Constipation', icon: '😖', category: 'Digestive' },
  { id: 's36', name: 'Anxiety', icon: '😰', category: 'Mental Health' },
  { id: 's37', name: 'Insomnia', icon: '🌃', category: 'Mental Health' },
  { id: 's38', name: 'Cold Hands/Feet', icon: '🧊', category: 'Cardiovascular' },
];

export const CATEGORIES = ['All', 'General', 'Digestive', 'Respiratory', 'Cardiovascular', 'Neurological', 'Musculoskeletal', 'Skin', 'Urological', 'Mental Health'];

export function analyzeSymptoms(selectedSymptoms, description) {
  const sym = selectedSymptoms.map(s => s.name.toLowerCase());
  let results = [];

  const gastro = ['nausea', 'vomiting', 'diarrhea', 'stomach pain', 'abdominal bloating'].filter(s => sym.some(x => x.includes(s)));
  if (gastro.length >= 2) results.push({ disease: 'Gastroenteritis', confidence: Math.min(60 + gastro.length * 8, 92), risk: gastro.length >= 4 ? 'High' : 'Moderate', specialty: 'Gastroenterology', description: 'Inflammation of the stomach and intestines, commonly caused by viral or bacterial infection.' });

  const flu = ['fever', 'cough', 'sore throat', 'runny nose', 'body aches', 'fatigue', 'chills'].filter(s => sym.some(x => x.includes(s)));
  if (flu.length >= 3) results.push({ disease: flu.includes('fever') && flu.includes('body aches') ? 'Influenza (Flu)' : 'Common Cold', confidence: Math.min(55 + flu.length * 6, 88), risk: 'Low', specialty: 'General Medicine', description: 'A viral respiratory illness affecting the nose, throat, and sometimes lungs.' });

  const cardiac = ['chest pain', 'shortness of breath', 'high blood pressure', 'palpitations', 'dizziness'].filter(s => sym.some(x => x.includes(s)));
  if (cardiac.length >= 2) results.push({ disease: cardiac.includes('chest pain') ? 'Possible Cardiac Concern' : 'Hypertension', confidence: Math.min(50 + cardiac.length * 10, 85), risk: cardiac.includes('chest pain') ? 'Critical' : 'High', specialty: 'Cardiology', description: 'Elevated blood pressure or cardiac irregularity requiring immediate medical evaluation.' });

  const resp = ['cough', 'shortness of breath', 'chest pain', 'fever', 'fatigue'].filter(s => sym.some(x => x.includes(s)));
  if (resp.filter(s => ['cough', 'shortness of breath'].includes(s)).length >= 1 && resp.length >= 3)
    results.push({ disease: 'Respiratory Infection / Pneumonia', confidence: Math.min(45 + resp.length * 9, 83), risk: sym.some(x => x.includes('shortness of breath')) ? 'High' : 'Moderate', specialty: 'Pulmonology', description: 'Infection of the respiratory tract possibly affecting the lungs.' });

  const uti = ['frequent urination', 'burning urination', 'fever', 'back pain'].filter(s => sym.some(x => x.includes(s)));
  if (uti.filter(s => ['frequent urination', 'burning urination'].includes(s)).length >= 1)
    results.push({ disease: 'Urinary Tract Infection (UTI)', confidence: Math.min(55 + uti.length * 10, 90), risk: 'Moderate', specialty: 'Urology', description: 'Bacterial infection affecting the urinary system.' });

  const dengue = ['fever', 'headache', 'body aches', 'rash', 'fatigue', 'chills', 'joint pain'].filter(s => sym.some(x => x.includes(s)));
  if (dengue.includes('fever') && dengue.includes('body aches') && dengue.includes('headache'))
    results.push({ disease: 'Viral / Dengue Fever', confidence: Math.min(50 + dengue.length * 7, 86), risk: dengue.length >= 5 ? 'High' : 'Moderate', specialty: 'Infectious Disease', description: 'Mosquito-borne viral illness with high fever, severe headache and muscle pain.' });

  const migraine = ['headache', 'nausea', 'blurred vision', 'vomiting', 'dizziness'].filter(s => sym.some(x => x.includes(s)));
  if (migraine.includes('headache') && migraine.length >= 2)
    results.push({ disease: 'Migraine', confidence: Math.min(50 + migraine.length * 9, 87), risk: 'Low', specialty: 'Neurology', description: 'A neurological condition characterized by intense, debilitating headaches.' });

  const skin = ['rash', 'itching', 'swelling', 'eye redness'].filter(s => sym.some(x => x.includes(s)));
  if (skin.length >= 2)
    results.push({ disease: 'Allergic Reaction / Dermatitis', confidence: Math.min(55 + skin.length * 10, 88), risk: skin.includes('swelling') ? 'Moderate' : 'Low', specialty: 'Dermatology', description: 'An inflammatory response of the skin to allergens or irritants.' });

  const diabetes = ['frequent urination', 'fatigue', 'blurred vision', 'weight loss', 'numbness'].filter(s => sym.some(x => x.includes(s)));
  if (diabetes.length >= 3)
    results.push({ disease: 'Possible Diabetes / Blood Sugar Irregularity', confidence: Math.min(40 + diabetes.length * 10, 78), risk: 'High', specialty: 'Endocrinology', description: 'Blood glucose regulation disorder requiring further diagnostic testing.' });

  const anxiety = ['anxiety', 'insomnia', 'palpitations', 'headache', 'fatigue'].filter(s => sym.some(x => x.includes(s)));
  if (anxiety.includes('anxiety') && anxiety.length >= 2)
    results.push({ disease: 'Anxiety / Stress Disorder', confidence: Math.min(50 + anxiety.length * 9, 85), risk: 'Low', specialty: 'Psychiatry', description: 'Psychological condition characterized by persistent worry and tension.' });

  if (description) {
    const desc = description.toLowerCase();
    if ((desc.includes('heart') || desc.includes('chest')) && !results.find(r => r.specialty === 'Cardiology'))
      results.push({ disease: 'Cardiac Evaluation Recommended', confidence: 65, risk: 'High', specialty: 'Cardiology', description: 'Your description suggests cardiac-related symptoms.' });
  }

  if (results.length === 0)
    results.push({ disease: 'General Malaise / Viral Syndrome', confidence: 55, risk: 'Low', specialty: 'General Medicine', description: 'Your symptoms may indicate a mild viral or stress-related condition.' });

  return results.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}

export const MOCK_HOSPITALS = [
  { id: 'H1', name: 'Apollo Hospitals', address: 'Jubilee Hills, Hyderabad', distance: '1.2 km', rating: 4.8, beds: 450, emergency: true, specialties: ['Cardiology', 'Gastroenterology', 'Neurology', 'Pulmonology', 'General Medicine', 'Orthopedics'] },
  { id: 'H2', name: 'Fortis Healthcare', address: 'Bannerghatta Rd, Bangalore', distance: '2.5 km', rating: 4.6, beds: 280, emergency: true, specialties: ['Cardiology', 'Urology', 'Dermatology', 'Endocrinology', 'General Medicine'] },
  { id: 'H3', name: 'Manipal Hospitals', address: 'HAL Airport Rd, Bangalore', distance: '3.8 km', rating: 4.7, beds: 600, emergency: true, specialties: ['Pulmonology', 'Neurology', 'Infectious Disease', 'Gastroenterology', 'Psychiatry'] },
  { id: 'H4', name: 'Narayana Health', address: 'Electronic City, Bangalore', distance: '5.1 km', rating: 4.5, beds: 350, emergency: false, specialties: ['Cardiology', 'Dermatology', 'General Medicine', 'Endocrinology'] },
  { id: 'H5', name: 'KIMS Hospital', address: 'Secunderabad, Hyderabad', distance: '6.3 km', rating: 4.4, beds: 200, emergency: true, specialties: ['Orthopedics', 'Neurology', 'General Medicine', 'Urology', 'Psychiatry'] },
];

export const MOCK_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
];