export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: unknown; output: unknown; }
};

export type AddMeasurementInput = {
  date: Scalars['String']['input'];
  reptile_id: Scalars['ID']['input'];
  size: Scalars['Float']['input'];
  size_mesure: Scalars['String']['input'];
  weight: Scalars['Float']['input'];
  weight_mesure: Scalars['String']['input'];
};

export type AddNotesResponse = {
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type AddReptileEventInput = {
  event_date: Scalars['String']['input'];
  event_name: Scalars['String']['input'];
  event_time: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type AddReptileInput = {
  acquired_date: Scalars['String']['input'];
  age: Scalars['Int']['input'];
  diet?: InputMaybe<Scalars['String']['input']>;
  feeding_schedule?: InputMaybe<Scalars['String']['input']>;
  health_status?: InputMaybe<Scalars['String']['input']>;
  humidity_level?: InputMaybe<Scalars['Int']['input']>;
  last_fed?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  next_vet_visit: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  origin?: InputMaybe<Scalars['String']['input']>;
  sex?: InputMaybe<Scalars['String']['input']>;
  sort_of_species?: InputMaybe<Scalars['String']['input']>;
  species: Scalars['String']['input'];
  temperature_range?: InputMaybe<Scalars['String']['input']>;
};

export type AuthPayload = {
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type DeleteReptileResponse = {
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Enclosure = {
  dimensions: Scalars['String']['output'];
  humidity?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  lighting?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  temperature?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  expo_token?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type LogoutResponse = {
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Measurement = {
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  reptile_id: Scalars['ID']['output'];
  size: Scalars['Float']['output'];
  size_mesure: Scalars['String']['output'];
  weight: Scalars['Float']['output'];
  weight_mesure: Scalars['String']['output'];
};

export type MedicalRecord = {
  date: Scalars['String']['output'];
  diagnosis?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  treatment?: Maybe<Scalars['String']['output']>;
  vet_name?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  addMeasurement?: Maybe<Measurement>;
  addNotes: AddNotesResponse;
  addReptile?: Maybe<Reptile>;
  addReptileEvent?: Maybe<ReptileEvent>;
  deleteReptile: DeleteReptileResponse;
  login: AuthPayload;
  logout: LogoutResponse;
  markAllNotificationsAsRead: Array<Notification>;
  markNotificationAsRead: Notification;
  register: AuthPayload;
};


export type MutationAddMeasurementArgs = {
  input: AddMeasurementInput;
};


export type MutationAddNotesArgs = {
  id: Scalars['ID']['input'];
  notes: Scalars['String']['input'];
};


export type MutationAddReptileArgs = {
  input: AddReptileInput;
};


export type MutationAddReptileEventArgs = {
  input: AddReptileEventInput;
};


export type MutationDeleteReptileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMarkAllNotificationsAsReadArgs = {
  user_id: Scalars['Int']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type Notification = {
  created_at: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  read?: Maybe<Scalars['Boolean']['output']>;
  sent: Scalars['Boolean']['output'];
  sent_at?: Maybe<Scalars['String']['output']>;
  user_id: Scalars['Int']['output'];
};

export type Query = {
  currentUser?: Maybe<User>;
  getNotifications: Array<Notification>;
  getUnreadNotificationsCount: Scalars['Int']['output'];
  measurements: Array<Measurement>;
  reptile?: Maybe<Reptile>;
  reptileEvent?: Maybe<Array<Maybe<ReptileEvent>>>;
  reptiles?: Maybe<Array<Maybe<Reptile>>>;
};


export type QueryGetUnreadNotificationsCountArgs = {
  user_id: Scalars['Int']['input'];
};


export type QueryMeasurementsArgs = {
  reptile_id: Scalars['ID']['input'];
};


export type QueryReptileArgs = {
  id: Scalars['ID']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Reptile = {
  acquired_date?: Maybe<Scalars['String']['output']>;
  age: Scalars['Int']['output'];
  diet?: Maybe<Scalars['String']['output']>;
  documents?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  enclosure?: Maybe<Enclosure>;
  feeding_schedule?: Maybe<Scalars['String']['output']>;
  gallery?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  health_status?: Maybe<Scalars['String']['output']>;
  humidity_level?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  last_fed: Scalars['String']['output'];
  last_vet_visit?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  medical_history?: Maybe<Array<Maybe<MedicalRecord>>>;
  name: Scalars['String']['output'];
  next_vet_visit?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  origin?: Maybe<Scalars['String']['output']>;
  sex?: Maybe<Scalars['String']['output']>;
  sort_of_species?: Maybe<Scalars['String']['output']>;
  species: Scalars['String']['output'];
  temperature_range?: Maybe<Scalars['String']['output']>;
};

export type ReptileEvent = {
  event_date: Scalars['String']['output'];
  event_name: Scalars['String']['output'];
  event_time: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
};

export type User = {
  email: Scalars['String']['output'];
  expo_token?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type AddReptileEventMutationVariables = Exact<{
  input: AddReptileEventInput;
}>;


export type AddReptileEventMutation = { addReptileEvent?: { event_name: string } | undefined };

export type ReptileEventQueryVariables = Exact<{ [key: string]: never; }>;


export type ReptileEventQuery = { reptileEvent?: Array<{ id: string, event_date: string, event_name: string, event_time: string, notes?: string | undefined } | undefined> | undefined };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { login: { success: boolean, message: string, token?: string | undefined, user?: { id: string, username: string, email: string } | undefined } };

export type MarkNotificationAsReadMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type MarkNotificationAsReadMutation = { markNotificationAsRead: { read?: boolean | undefined } };

export type GetNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotificationsQuery = { getNotifications: Array<{ id: number, user_id: number, message: string, sent: boolean, read?: boolean | undefined, created_at: string, sent_at?: string | undefined }> };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { register: { success: boolean, message: string, token?: string | undefined, user?: { id: string, username: string, email: string } | undefined } };

export type AddMeasurementMutationVariables = Exact<{
  input: AddMeasurementInput;
}>;


export type AddMeasurementMutation = { addMeasurement?: { id: string } | undefined };

export type AddNotesMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  notes: Scalars['String']['input'];
}>;


export type AddNotesMutation = { addNotes: { success: boolean, message: string } };

export type MeasurementsQueryVariables = Exact<{
  reptileId: Scalars['ID']['input'];
}>;


export type MeasurementsQuery = { measurements: Array<{ id: string, reptile_id: string, date: string, weight: number, size: number, size_mesure: string, weight_mesure: string }> };

export type AddReptilesMutationVariables = Exact<{
  input: AddReptileInput;
}>;


export type AddReptilesMutation = { addReptile?: { id: string, name: string } | undefined };

export type RemoveReptileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveReptileMutation = { deleteReptile: { success: boolean, message: string } };

export type ReptileQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ReptileQuery = { reptile?: { id: string, name: string, species: string, age: number, last_fed: string, notes?: string | undefined, image_url?: string | undefined, sort_of_species?: string | undefined, feeding_schedule?: string | undefined, diet?: string | undefined, humidity_level?: number | undefined, temperature_range?: string | undefined, health_status?: string | undefined, last_vet_visit?: string | undefined, next_vet_visit?: string | undefined, acquired_date?: string | undefined, origin?: string | undefined, location?: string | undefined, medical_history?: Array<{ date: string, diagnosis?: string | undefined, treatment?: string | undefined, vet_name?: string | undefined, notes?: string | undefined } | undefined> | undefined, enclosure?: { id: string, type: string, dimensions: string, temperature?: string | undefined, humidity?: number | undefined, lighting?: string | undefined, notes?: string | undefined } | undefined } | undefined };

export type ReptilesQueryVariables = Exact<{ [key: string]: never; }>;


export type ReptilesQuery = { reptiles?: Array<{ id: string, name: string, species: string, age: number, last_fed: string, image_url?: string | undefined, sex?: string | undefined } | undefined> | undefined };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: { success: boolean, message: string } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { currentUser?: { id: string, username: string, email: string } | undefined };
