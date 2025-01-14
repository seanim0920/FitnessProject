// Generated by Roswaal, do not touch.

import * as TestActions from "./TestActions"
import { launchApp } from "../Launch"
import { RoswaalTestCase } from "../TestCase"
import { roswaalClient } from "../Client"

test("Create Public Surfing Event", async () => {
  const testCase = new RoswaalTestCase("Create Public Surfing Event", TestActions.beforeLaunch)
  // Bill creates surfing competition event at Santa Cruz Boardwalk Beach next Friday afternoon.
  testCase.appendAction(TestActions.haveBillCreateTheSurfingCompetitionEventAtSantaCruzBoardwalkBeachNextFridayAt300Pm)
  // Bill views his event to ensure the details are correct.
  testCase.appendAction(TestActions.verifyThatBillCanViewTheDetailsOfThesurfingCompetitionEvent)
  // Set Location to Santa Cruz Boardwalk Beach
  testCase.appendAction(TestActions.setLocationToSantaCruzBoardwalkBeach)
  // Jane views Bill's event and considers joining.
  testCase.appendAction(TestActions.verifyThatJaneCanViewTheDetailsOfThesurfingCompetitionEvent)
  await roswaalClient.run(testCase)
})
