const fs = require("fs")
const path = require("path")

const COMPONENTS_DIR = path.resolve(__dirname, ".storybook/components")
const STORYBOOK_FILE = path.resolve(
  __dirname,
  ".storybook/.ondevice/Storybook.tsx"
)

const addStoryToStorybook = (storyName) => {
  let storybookContent = fs.readFileSync(STORYBOOK_FILE, "utf-8")
  const importStatement = `import ${storyName}Meta, { Basic as ${storyName} } from "../components/${storyName}/${storyName}.stories";`

  // Add import at the top
  if (!storybookContent.includes(importStatement)) {
    const firstImportIndex = storybookContent.indexOf("import")
    const nextLineIndex = storybookContent.indexOf("\n", firstImportIndex)
    storybookContent = [
      storybookContent.slice(0, nextLineIndex + 1),
      importStatement,
      storybookContent.slice(nextLineIndex + 1)
    ].join("\n")
  }

  // Add to the `stories` array
  const storiesArrayStartIndex = storybookContent.indexOf("const stories = [")
  if (storiesArrayStartIndex === -1) {
    throw new Error("Could not find `stories` array in Storybook.tsx.")
  }

  const storiesArrayEndIndex = storybookContent.indexOf(
    "];",
    storiesArrayStartIndex
  )
  const insertionPoint = storybookContent.lastIndexOf(
    "},",
    storiesArrayEndIndex
  )
  const insertionOffset =
    insertionPoint !== -1
      ? insertionPoint + 2
      : storiesArrayStartIndex + "const stories = [".length

  const storyEntry = `  {
    name: ${storyName}Meta.title,
    component: ${storyName},
    args: ${storyName}Meta.args
  },`

  storybookContent = [
    storybookContent.slice(0, insertionOffset),
    storyEntry,
    storybookContent.slice(insertionOffset)
  ].join("\n")

  fs.writeFileSync(STORYBOOK_FILE, storybookContent, "utf-8")
}

const createComponentFile = (storyName, folderPath) => {
  const componentContent = `import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const ${storyName} = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>${storyName} Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});
`

  const componentFilePath = path.join(folderPath, `${storyName}.tsx`)
  fs.writeFileSync(componentFilePath, componentContent, "utf-8")
}

const createComponentFolder = (storyName) => {
  const storyFolderPath = path.join(COMPONENTS_DIR, storyName)
  if (!fs.existsSync(storyFolderPath)) {
    fs.mkdirSync(storyFolderPath, { recursive: true })
  }

  // Create the component file first
  createComponentFile(storyName, storyFolderPath)

  const storiesFileContent = `import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoryMeta } from "storybook/HelperTypes";
import { ${storyName} } from "./${storyName}";

export const ${storyName}Meta: StoryMeta = {
  title: "${storyName}",
};

export default ${storyName}Meta;

export const Basic = () => (
  <GestureHandlerRootView style={styles.container}>
    <SafeAreaView style={styles.safeArea}>
      <${storyName} />
    </SafeAreaView>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 16,
  },
});
`

  const storiesFilePath = path.join(storyFolderPath, `${storyName}.stories.tsx`)
  fs.writeFileSync(storiesFilePath, storiesFileContent, "utf-8")
}

// @ts-ignore Node types not recognized
if (process.argv[1].includes(__dirname)) {
  // @ts-ignore Node types not recognized
  const args = process.argv.slice(2)
  if (args.length !== 1) {
    console.error("Usage: npm run create-story <StoryName>")
    // @ts-ignore Node types not recognized
    process.exit(1)
  }

  const [storyName] = args
  createComponentFolder(storyName)
  addStoryToStorybook(storyName)

  console.log(`Story "${storyName}" created successfully.`)
}
