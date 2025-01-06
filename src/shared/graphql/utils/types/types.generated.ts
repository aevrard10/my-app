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
  age: Scalars['Int']['input'];
  last_fed: Scalars['String']['input'];
  name: Scalars['String']['input'];
  sort_of_species?: InputMaybe<Scalars['String']['input']>;
  species: Scalars['String']['input'];
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

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LogoutResponse = {
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  addNotes: AddNotesResponse;
  addReptile?: Maybe<Reptile>;
  addReptileEvent?: Maybe<ReptileEvent>;
  deleteReptile: DeleteReptileResponse;
  login: AuthPayload;
  logout: LogoutResponse;
  register: AuthPayload;
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


export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type Query = {
  currentUser?: Maybe<User>;
  reptile?: Maybe<Reptile>;
  reptileEvent?: Maybe<Array<Maybe<ReptileEvent>>>;
  reptiles?: Maybe<Array<Maybe<Reptile>>>;
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
  age: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  last_fed: Scalars['String']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  sort_of_species?: Maybe<Scalars['String']['output']>;
  species: Scalars['String']['output'];
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
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type AddReptileEventMutationVariables = Exact<{
  input: AddReptileEventInput;
}>;


export type AddReptileEventMutation = { addReptileEvent?: { event_name: string } | undefined };

export type ReptileEventQueryVariables = Exact<{ [key: string]: never; }>;


export type ReptileEventQuery = { reptileEvent?: Array<{ id: string, event_date: string, event_name: string, event_time: string, notes?: string | undefined } | undefined> | undefined };

export type AddReptilesMutationVariables = Exact<{
  input: AddReptileInput;
}>;


export type AddReptilesMutation = { addReptile?: { name: string } | undefined };

export type RemoveReptileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveReptileMutation = { deleteReptile: { success: boolean, message: string } };

export type ReptileQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ReptileQuery = { reptile?: { id: string, name: string, species: string, age: number, last_fed: string, notes?: string | undefined, image_url?: string | undefined, sort_of_species?: string | undefined } | undefined };

export type ReptilesQueryVariables = Exact<{ [key: string]: never; }>;


export type ReptilesQuery = { reptiles?: Array<{ id: string, name: string, species: string, age: number, last_fed: string, image_url?: string | undefined } | undefined> | undefined };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { login: { success: boolean, message: string, token?: string | undefined, user?: { id: string, username: string, email: string } | undefined } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { register: { success: boolean, message: string, token?: string | undefined, user?: { id: string, username: string, email: string } | undefined } };

export type AddNotesMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  notes: Scalars['String']['input'];
}>;


export type AddNotesMutation = { addNotes: { success: boolean, message: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: { success: boolean, message: string } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { currentUser?: { id: string, username: string, email: string } | undefined };
