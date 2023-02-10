import API, { GraphQLResult } from "@aws-amplify/api"
import { GraphQLError } from "graphql"
import { createDependencyKey } from "./dependencies"
import { MultiplexedError } from "./MultiplexedError"

/**
 * A generic interface for any grapql based API.
 */
export interface GraphQLOperations {
  /**
   * Executes a grapql request and returns the data from its response.
   *
   * @param statement a grapql query
   * @param variables variables needed by the query
   */
  execute: <T>(statement: string, variables?: object) => Promise<T>

  // TODO: - Add a subscribe function
}

/**
 * An error thrown from a `GraphQLOperationsInstance`.
 */
export class GraphQLOperationsError<T> extends Error {
  readonly data?: T
  readonly error: MultiplexedError<GraphQLError>

  constructor ({ data, errors }: { data?: T; errors: GraphQLError[] }) {
    const error = new MultiplexedError(errors)
    super(error.message)
    this.error = error
    this.data = data
  }
}

/**
 * GraphQL operations backed by AWS Amplify.
 */
export class AmplifyGraphQLOperations implements GraphQLOperations {
  async execute<T> (statement: string, variables?: object): Promise<T> {
    const result = (await API.graphql({
      query: statement,
      variables
    })) as GraphQLResult<T>

    if (result.errors) {
      throw new GraphQLOperationsError({
        data: result.data,
        errors: result.errors
      })
    }
    return result.data as T
  }
}

const keyOperations = new AmplifyGraphQLOperations() as GraphQLOperations

/**
 * A `DependencyKey` for a `GraphQL` operations instance.
 */
export const graphQLOperationsDependencyKey = createDependencyKey(keyOperations)
