'use client'

import { FormEvent, useEffect, useState } from "react";
import LabeledInput from "../components/LabeledInput";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import { generateVerificationCode } from "@/utils/functions/generateVerificationCode";
import { updateVercelRedirects } from "@/utils/vercel/updateVercelRedirects";
import Entri, { EntriConfig } from 'entrijs';

type DomainComponentProps = {
  enabled: boolean;
  targetUserId: string | null;
}

const DomainComponent: React.FC<DomainComponentProps> = ({ enabled, targetUserId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserType>({});
  const [domain, setDomain] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [config, setConfig] = useState<EntriConfig>();

  useEffect(() => {
    const fetchUserDomain = async () => {
      const response = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({ targetUserId })
      });

      const data = await response.json();
      setUserData(data);
      setDomain(data.domain);
      setVerificationCode(data.domain_verification_code);
    }

    fetchUserDomain();
    const fetchToken = () => {
      fetch('https://api.goentri.com/token', {
        method: 'POST',
        body: JSON.stringify({
          applicationId: process.env.NEXT_PUBLIC_ENTRI_APP_ID,
          secret: process.env.NEXT_PUBLIC_ENTRI_CLIENT_SECRETS
        }),
      })
        .then(response => response.json())
        .then(data => {
          setConfig({
            applicationId: process.env.NEXT_PUBLIC_ENTRI_APP_ID!, // From the Entri dashboard
            token: data.auth_token, 
            dnsRecords: [
              {
                type: "CNAME",
                host: "www",
                value: "m.test.com",
                ttl: 300,
              },
              {
                type: "TXT",
                host: "@",
                value: "sample-txt-record",
                ttl: 300,
              },
              {
                type: "MX",
                host: "host",
                value: "mailhost1.example.com",
                priority: 10,
                ttl: 300,
              }
            ],
          })
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    fetchToken();
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!verificationCode) {
      return;
    }

    setIsLoading(true);
    const response = await fetch("/api/domain/verify", {
      method: "POST",
      body: JSON.stringify({ targetUserId, domain, verificationCode })
    });

    const data = await response.json();

    setIsLoading(false);

    if (data.error) {
      console.error(data.error);
      return;
    }

    addDomainToVercel(domain);
  }

  const addDomainToVercel = async (domain: string) => {
    const response = await fetch("https://api/vercel.com/v4/domains", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VERCEL_API_KEY}`
      },
      body: JSON.stringify({
        name: domain,
        projectId: process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID,
      })
    })

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
    } else {
      updateVercelRedirects(userData.username!, domain);

      console.log("Added domain to Vercel successfully!")
    }
  }

  const generateCode = () => {
    setVerificationCode(generateVerificationCode());
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold text-dark text-start w-full mt-4 mb-0">
          Domain Name
        </h2>

        <div className="text-sm text-gray-500 my-2 ml-2">If you own a domain, please link it to your bio.</div>

        <LabeledInput
          label="Domain Name"
          name="domain"
          value={domain || ""}
          onChange={e => setDomain(e.target.value)}
        />

        <div className="flex w-full justify-between items-center gap-2">
          <LabeledInput
            label="Verification Code"
            name="verification_code"
            value={verificationCode || ""}
            readOnly
            required
          />

          <FullRoundedButton onClick={generateCode} className="mb-3" type="button" buttonType="warning">Generate</FullRoundedButton>
        </div>

        <div className="flex justify-end">
          <FullRoundedButton isLoading={isLoading} type="submit">Save</FullRoundedButton>
        </div>
      </form>

      <FullRoundedButton type="button" onClick={() => Entri.purchaseDomain(config!)}> Launch Entri </FullRoundedButton>
    </div>
  );
}

export default DomainComponent;
