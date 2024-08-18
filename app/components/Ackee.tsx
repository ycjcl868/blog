import { useLocation } from '@remix-run/react';
import useAckee from 'use-ackee';

const Ackee = ({ ackeeServerUrl, ackeeDomainId }) => {
  const location = useLocation();
  useAckee(
    location.pathname,
    { server: ackeeServerUrl, domainId: ackeeDomainId },
    { detailed: false, ignoreLocalhost: true }
  );
  return null;
};

export default Ackee;
