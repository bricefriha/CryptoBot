
import Checker from "./controllers/checker.ts";
const checker = new Checker();

checker.Run();
checker.SendNotification("Information", "the server just started");
