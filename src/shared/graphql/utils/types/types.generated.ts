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

export type AddReptileInput = {
  age: Scalars['Int']['input'];
  last_fed: Scalars['String']['input'];
  name: Scalars['String']['input'];
  species: Scalars['String']['input'];
};

export type DeleteReptileResponse = {
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  addReptile?: Maybe<Reptile>;
  deleteReptile: DeleteReptileResponse;
};


export type MutationAddReptileArgs = {
  input: AddReptileInput;
};


export type MutationDeleteReptileArgs = {
  id: Scalars['ID']['input'];
};

export type Query = {
  reptiles?: Maybe<Array<Maybe<Reptile>>>;
};

export type Reptile = {
  age: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  last_fed: Scalars['String']['output'];
  name: Scalars['String']['output'];
  species: Scalars['String']['output'];
};

export type AddReptilesMutationVariables = Exact<{
  input: AddReptileInput;
}>;


export type AddReptilesMutation = { addReptile?: { name: string } | undefined };

export type RemoveReptileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveReptileMutation = { deleteReptile: { success: boolean, message: string } };

export type ReptilesQueryVariables = Exact<{ [key: string]: never; }>;


export type ReptilesQuery = { reptiles?: Array<{ id: string, name: string, species: string, age: number, last_fed: string } | undefined> | undefined };
