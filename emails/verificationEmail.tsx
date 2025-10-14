import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Section,
  Row,
  Heading,
  Text,
} from "@react-email/components";

interface props {
  username: string;
  otp: string;
}
export default function VerificationEmail({ username, otp }: props) {
  return (
    <Html lang="en">
      <Head>
        <title>Verificaition Code</title>
      </Head>
      <Preview>Here&apos;s your verification code:{otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Plese use the following verification code
            to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>If you did not request this code plese ignore.</Text>
        </Row>
      </Section>
    </Html>
  );
}
