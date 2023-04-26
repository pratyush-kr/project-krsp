export interface KnowMore {
  header: string;
  whatQuestion: string;
  whatAnswer: string;
  symptomsTitle: string;
  symptoms: string[];
  causeQuestion: string;
  causeAnswer: string;
  causes: string[];
  treatmentTitle: string;
  treatmentParagraph: string;
  copingHeader: string;
  copingParagraph: string;
  coping: string[];
  resourcesHeader: string;
  resourcesParagraph: string;
  resourcesList: {
    text: string;
    href: string;
    url_text: string;
  }[];
}
