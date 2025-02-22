import { Auth } from "@aws-amplify/auth"
import { SecureStore } from "@lib/SecureStore"
import * as ExpoSecureStore from "expo-secure-store"
import awsExports from "src/aws-exports"
import awsmobile from "../src/aws-exports"
import { CognitoSecureStorage } from "./CognitoSecureStorage"

/**
 * Sets up cognito with a secure store.
 */
export const setupCognito = (secureStore: SecureStore = ExpoSecureStore) => {
  Auth.configure({
    ...awsExports,
    storage: new CognitoSecureStorage(secureStore),
    identityPoolId: awsmobile.aws_cognito_identity_pool_id,
    region: awsmobile.aws_cognito_region,
    userPoolId: awsmobile.aws_user_pools_id,
    userPoolWebClientId: awsmobile.aws_user_pools_web_client_id,
    oauth: awsmobile.oauth,
    mandatorySignIn: false // Add this line to enable unauthenticated access
  })
}

/**
 * An error code thrown by cognito.
 */
export type CognitoErrorCode =
  | "CodeMismatchException"
  | "UsernameExistsException"
  | "NotAuthorizedException"
  | "UserNotFoundException"
  | "UserNotConfirmedException"
  | "InvalidParameterException"

/**
 * An {@link Error} subclass that mimicks a Cognito error for testing purposes.
 *
 * This is useful because cognito just adds a `code` field to {@link Error} directly,
 * which is invalid typescript.
 */
export class TestCognitoError extends Error {
  code: CognitoErrorCode

  constructor(code: CognitoErrorCode) {
    super()
    this.code = code
  }
}

/**
 * Returns true if the given error object is an instance of {@link Error} and has a property
 * `code` that matches the given Cognito error code.
 */
export const isCognitoErrorWithCode = (
  error: unknown,
  code: CognitoErrorCode
) => {
  if (error instanceof Error && "code" in error) {
    return error.code === code
  }
  return false
}
