import { useSessionLogStore } from "../stores/sessionLogStore";

export default function Postsurvey() {
  const logs = useSessionLogStore((state) => state.logs);

  const session1Logs = logs.filter((log) => log.sessionId === "session1");
  const session2Logs = logs.filter((log) => log.sessionId === "session2");

  return (
    <div>
      <h1>Session Summary</h1>

      <h2>Session 1</h2>
      <p>Total: {session1Logs.length} logs</p>
      <ul>
        {session1Logs.map((log, index) => (
          <li key={`s1-${index}`}>
            Case: {log.caseId} | Confidence: {log.confidence} | Time: {log.durationMs}ms
          </li>
        ))}
      </ul>

      <h2>Session 2</h2>
      <p>Total: {session2Logs.length} logs</p>
      <ul>
        {session2Logs.map((log, index) => (
          <li key={`s2-${index}`}>
            Case: {log.caseId} | Confidence: {log.confidence} | Time: {log.durationMs}ms
          </li>
        ))}
      </ul>
    </div>
  );
}