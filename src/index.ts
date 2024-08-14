
import Checker from "./controllers/Checker.ts";
const checker = new Checker();

checker.Run();
checker.SendNotification("Information", "the server just started");
