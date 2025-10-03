export type ClassicAuthSchema = {
  username: string;
  password: string;
};

export type MoodleAuthContext = {
  token: string;
};

export type MoodleAssignment = {
  id: number;
  name: string;
  dueDate: Date;
  courseId: number;
};

export type IFGoianoPresencialCredentials = {
  username: string;
  password: string;
};

export type SuapAuthContext = {
  access: string;
  refresh: string;
};

export type AuthContext = {
  creds: ClassicAuthSchema | null;
  ead: MoodleAuthContext | null;
  api: SuapAuthContext | null;
};

// ====== MOODLE API TYPES ======

export type MoodleLoginInput = {
  username: string;
  password: string;
};

export type MoodleLoginOutput = {
  token: string;
  privatetoken: string;
};

export type MoodleError = {
  error?: string;
  errorcode?: string;
  exception?: string;
  message?: string;
  stacktrace?: string;
  debuginfo?: string;
  reproductionlink?: string;
};

export type MoodleSiteInfo = {
  fullname: string;
  sitename: string;
  firstname: string;
  lang: string;
  userpictureurl: string;
  release: string;
  version: string;
  userid: number;
};

export type MoodleCourse = {
  id: number;
  shortname: string;
  fullname: string;
  displayname: string;
  enrolledusercount: number;
  idnumber: string;
  visible: number;
  summary: string;
  summaryformat: number;
  format: "topics";
  showgrades: boolean;
  lang: string;
  enablecompletion: boolean;
  completionhascriteria: boolean;
  completionusertracked: boolean;
  category: number;
  progress: number;
  completed: boolean;
  startdate: number;
  enddate: number;
  marker: number;
  lastaccess: number;
  isfavourite: boolean;
  hidden: boolean;
  overviewfiles: string[];
  showactivitydates: boolean;
  showcompletionconditions: boolean;
};

export type MoodleModuleData = {
  id: number;
  name: string;
  instance: number;
  modname: string;
  url: string;
  completiondata: { state: number; timecompleted: number } | null;
  completion: number;
  uservisible: boolean;
  dates?: { timestamp: number }[];
  customdata?: string;
};

export type MoodleContentData = {
  name: string;
  modules: MoodleModuleData[];
};

export type MoodleModule = {
  name: string;
  parent: string;
  kind: string;
  url: string;
  allowSubmissionsFrom?: Date;
  dueDate?: Date;
  hasCompleted: boolean;
  id: number;
  instance: number;
};

export type MoodleQuiz = {
  id: number;
  course: number;
  coursemodule: number;
  name: string;
  intro: string;
  introformat: number;
  introfiles: unknown[];
  timeopen: number;
  timeclose: number;
  timelimit: number;
  preferredbehaviour: string;
  attempts: number;
  grademethod: number;
  decimalpoints: number;
  questiondecimalpoints: number;
  sumgrades: number;
  grade: number;
  hasfeedback: number;
  section: number;
  visible: number;
  groupmode: number;
  groupingid: number;
};

export type MoodleAssignmentCourse = {
  id: number;
  fullname: string;
  shortname: string;
  timemodified: number;
  assignments: MoodleAssignmentDetail[];
};

export type MoodleAssignmentDetail = {
  id: number;
  cmid: number;
  course: number;
  name: string;
  nosubmissions: number;
  submissiondrafts: number;
  sendnotifications: number;
  sendlatenotifications: number;
  sendstudentnotifications: number;
  duedate: number;
  allowsubmissionsfromdate: number;
  grade: number;
  timemodified: number;
  completionsubmit: number;
  cutoffdate: number;
  gradingduedate: number;
  teamsubmission: number;
  requireallteammemberssubmit: number;
  teamsubmissiongroupingid: number;
};

export type MoodleAssignmentsResponse = {
  courses: MoodleAssignmentCourse[];
  warnings: unknown[];
};

// ====== API RESPONSE TYPES ======

export type GetEnrolledCoursesResponse = {
  courses: MoodleCourse[];
};

export type GetAvailableModulesResponse = {
  modules: MoodleModule[];
};

export type WhoamiResponse = {
  firstName: string;
  fullName: string;
  pictureUrl: string;
};

export type CourseCompletionStatusResponse = {
  completions: {
    courseId: number;
    userid: number;
    completiondate: number | null;
    eligible: boolean;
    inprogress: boolean;
  }[];
};
