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

export type AddFoodStockInput = {
  name: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  type: Scalars['String']['input'];
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
  recurrence_type?: InputMaybe<RecurrenceType>;
  recurrence_interval?: InputMaybe<Scalars['Int']['input']>;
  recurrence_until?: InputMaybe<Scalars['String']['input']>;
};

export enum RecurrenceType {
  None = 'NONE',
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY'
}

export type AddReptileInput = {
  acquired_date?: InputMaybe<Scalars['String']['input']>;
  age: Scalars['Int']['input'];
  diet?: InputMaybe<Scalars['String']['input']>;
  feeding_schedule?: InputMaybe<Scalars['String']['input']>;
  health_status?: InputMaybe<Scalars['String']['input']>;
  humidity_level?: InputMaybe<Scalars['Int']['input']>;
  last_fed?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
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

export type FoodStock = {
  id: Scalars['ID']['output'];
  last_updated: Scalars['String']['output'];
  name: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  unit: Scalars['String']['output'];
};

export type FoodStockHistory = {
  date: Scalars['String']['output'];
  food_id: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  quantity_change: Scalars['Int']['output'];
  reason?: Maybe<Scalars['String']['output']>;
};

export type LastFedUpdateResponse = {
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
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

export type Mutation = {
  addFoodStock: FoodStock;
  addMeasurement?: Maybe<Measurement>;
  addNotes: AddNotesResponse;
  addReptile?: Maybe<Reptile>;
  addReptileEvent?: Maybe<ReptileEvent>;
  deleteReptile: DeleteReptileResponse;
  lastFedUpdate?: Maybe<LastFedUpdateResponse>;
  login: AuthPayload;
  logout: LogoutResponse;
  markAllNotificationsAsRead: Array<Notification>;
  markNotificationAsRead: Notification;
  register: AuthPayload;
  updateFoodStock: MutationResponse;
  updateReptile: ReptileUpdateResponse;
};


export type MutationAddFoodStockArgs = {
  input: AddFoodStockInput;
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


export type MutationLastFedUpdateArgs = {
  id: Scalars['ID']['input'];
  last_fed: Scalars['String']['input'];
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


export type MutationUpdateFoodStockArgs = {
  input: UpdateFoodStockInput;
};


export type MutationUpdateReptileArgs = {
  id: Scalars['ID']['input'];
  input: ReptileInput;
};

export type MutationResponse = {
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
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
  foodStock: Array<FoodStock>;
  foodStockHistory: Array<FoodStockHistory>;
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
  feeding_schedule?: Maybe<Scalars['String']['output']>;
  gallery?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  health_status?: Maybe<Scalars['String']['output']>;
  humidity_level?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  last_fed: Scalars['String']['output'];
  location?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
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
  recurrence_type?: Maybe<RecurrenceType>;
  recurrence_interval?: Maybe<Scalars['Int']['output']>;
  recurrence_until?: Maybe<Scalars['String']['output']>;
};

export type ReptileInput = {
  acquired_date?: InputMaybe<Scalars['String']['input']>;
  age?: InputMaybe<Scalars['Int']['input']>;
  diet?: InputMaybe<Scalars['String']['input']>;
  feeding_schedule?: InputMaybe<Scalars['String']['input']>;
  health_status?: InputMaybe<Scalars['String']['input']>;
  humidity_level?: InputMaybe<Scalars['String']['input']>;
  last_fed?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  origin?: InputMaybe<Scalars['String']['input']>;
  sex?: InputMaybe<Scalars['String']['input']>;
  sort_of_species?: InputMaybe<Scalars['String']['input']>;
  species: Scalars['String']['input'];
  temperature_range?: InputMaybe<Scalars['String']['input']>;
};

export type ReptileUpdateResponse = {
  message: Scalars['String']['output'];
  reptile?: Maybe<Reptile>;
  success: Scalars['Boolean']['output'];
};

export type UpdateFoodStockInput = {
  food_id: Scalars['ID']['input'];
  quantity_change: Scalars['Int']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  email: Scalars['String']['output'];
  expo_token?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type AddFoodStockMutationVariables = Exact<{
  input: AddFoodStockInput;
}>;


export type AddFoodStockMutation = { addFoodStock: { id: string } };

export type AddMeasurementMutationVariables = Exact<{
  input: AddMeasurementInput;
}>;


export type AddMeasurementMutation = { addMeasurement?: { id: string } | undefined };

export type AddReptileEventMutationVariables = Exact<{
  input: AddReptileEventInput;
}>;


export type AddReptileEventMutation = { addReptileEvent?: { event_name: string } | undefined };

export type ReptileEventQueryVariables = Exact<{ [key: string]: never; }>;


export type ReptileEventQuery = { reptileEvent?: Array<{ id: string, event_date: string, event_name: string, event_time: string, notes?: string | undefined, recurrence_type?: RecurrenceType | undefined, recurrence_interval?: number | undefined, recurrence_until?: string | undefined } | undefined> | undefined };

export type UpdateFoodStockMutationVariables = Exact<{
  input: UpdateFoodStockInput;
}>;


export type UpdateFoodStockMutation = { updateFoodStock: { success: boolean, message: string } };

export type FoodStockQueryVariables = Exact<{ [key: string]: never; }>;


export type FoodStockQuery = { foodStock: Array<{ id: string, name: string, quantity: number, unit: string, last_updated: string, type: string }> };

export type FoodStockHistoryQueryVariables = Exact<{ [key: string]: never; }>;


export type FoodStockHistoryQuery = { foodStockHistory: Array<{ id: string, food_id: string, quantity_change: number, reason?: string | undefined, date: string }> };

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

export type AddNotesMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  notes: Scalars['String']['input'];
}>;


export type AddNotesMutation = { addNotes: { success: boolean, message: string } };

export type LastFedUpdateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  last_fed: Scalars['String']['input'];
}>;


export type LastFedUpdateMutation = { lastFedUpdate?: { success: boolean, message: string } | undefined };

export type UpdateReptileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: ReptileInput;
}>;


export type UpdateReptileMutation = { updateReptile: { success: boolean, message: string } };

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


export type ReptileQuery = { reptile?: { id: string, name: string, species: string, age: number, last_fed: string, notes?: string | undefined, image_url?: string | undefined, sort_of_species?: string | undefined, feeding_schedule?: string | undefined, diet?: string | undefined, humidity_level?: number | undefined, temperature_range?: string | undefined, health_status?: string | undefined, acquired_date?: string | undefined, origin?: string | undefined, location?: string | undefined } | undefined };

export type ReptilesQueryVariables = Exact<{ [key: string]: never; }>;


export type ReptilesQuery = { reptiles?: Array<{ id: string, name: string, species: string, age: number, last_fed: string, image_url?: string | undefined, sex?: string | undefined } | undefined> | undefined };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: { success: boolean, message: string } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { currentUser?: { id: string, username: string, email: string } | undefined };
