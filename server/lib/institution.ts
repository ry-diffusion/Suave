export interface InstitutionMoodle {
  moodleUrl: string;
}

export interface InstitutionSuap {
  suapUrl: string;
}

export interface Institution {
  name: string;
  id: string;

  moodle?: InstitutionMoodle;
  suap?: InstitutionSuap;
}
