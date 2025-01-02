const diseases = [
    { name: 'Anthracnose', colorClass: 'red-300' },
    { name: 'Bacterial Canker', colorClass: 'byellow-300' },
    { name: 'Cutting Weevil', colorClass: 'bgreen-300' },
    { name: 'Die Back', colorClass: 'gray-300' },
    { name: 'Gall Midge', colorClass: 'orange-300' },
    { name: 'Healthy', colorClass: 'green-200' },
    { name: 'Powdery Mildew', colorClass: 'gray-100' },
    { name: 'Sooty Mould', colorClass: 'gray-400' }
  ];

  // Utility function to get color class for a disease
export const DiseaseColor = (diseaseName:string) => {
    const disease = diseases.find(d => d.name.toLowerCase() === diseaseName.toLowerCase());
    return disease ? disease.colorClass : 'gray-100'; // default color
};