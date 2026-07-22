import { useSessionStore } from '../../store';

export function useTranscript() {
  const transcript = useSessionStore((s) => s.transcript);
  const digest = useSessionStore((s) => s.digest);
  const isDigestLoading = useSessionStore((s) => s.isDigestLoading);
  const requestDigest = useSessionStore((s) => s.setDigestLoading);

  return {
    entries: transcript,
    digest,
    isDigestLoading,
    requestDigest: () => requestDigest(true),
  };
}
