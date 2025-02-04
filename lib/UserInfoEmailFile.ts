import {
  cacheDirectory,
  deleteAsync,
  readAsStringAsync,
  writeAsStringAsync
} from "expo-file-system"
import { UserID } from "TiFShared/domain-models/User"
import { featureContext } from "./FeatureContext"

export interface UserInfoEmailFile {
  createTempIDFile: (id: UserID) => Promise<string | undefined>
  deleteTempIDFile: (id: UserID) => Promise<void>
}

const createTempUserFile = async (id: UserID) => {
  const fileURI = cacheDirectory + "userID.txt"
  const content = `UserID: ${id}`

  try {
    await writeAsStringAsync(fileURI, content)
    return fileURI
  } catch {
    return undefined
  }
}

const deleteTempUserFile = async (id: UserID) => {
  const fileURI = cacheDirectory + "userID.txt"
  const content = await readAsStringAsync(fileURI)
  if (content === `UserID: ${id}`) {
    await deleteAsync(fileURI)
  }
}

export const UserInfoEmailFileFeature = featureContext({
  createTempIDFile: createTempUserFile,
  deleteTempIDFile: deleteTempUserFile
})
