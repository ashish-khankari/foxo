export type Status = 'normal' | 'watch' | 'high';

// How hard a marker is for a non-expert to understand.
export type Complexity = 'Basic' | 'Intermediate' | 'Advanced';

export type Biomarker = {
  id: string;
  name: string;
  category: string; // NEW
  complexity: Complexity;
  unit: string;
  range: string;
  status: Status;
  history: number[];
  meaning: string;
};

export type RootStackParamList = {
  List: undefined;
  Detail: { id: string };
};
