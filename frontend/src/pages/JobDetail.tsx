import { useParams, Link } from "react-router-dom";
import { Text } from "welcome-ui/Text";
import { Tag } from "welcome-ui/Tag";
import { Card } from "welcome-ui/Card";
import { Button } from "welcome-ui/Button";
import { Link as WUILink } from "welcome-ui/Link";
import { useJob } from "../hooks/useJobs";
import Cookies from "js-cookie";
import React from "react";
import { Applicant } from "../types/types";
import { Table } from "welcome-ui/Table";

export const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const bearerToken = Cookies.get("user-token");

  const { data: job, isLoading, isError, error } = useJob(jobId);
  if (isLoading) return <Text>Loading...</Text>;
  if (isError)
    return <Text className="text-red-70">Error: {error.message}</Text>;
  if (!job) return <Text>Job not found</Text>;

  console.log("job>>", job.applicants);

  return (
    <div className="p-xl max-w-1200 my-0 mx-auto">
      <WUILink
        as={Link}
        to="/"
        variant="secondary"
        className="mb-md inline-block"
      >
        ← Back to jobs
      </WUILink>

      <div className="flex items-start justify-between gap-md mb-lg">
        <div>
          <Text variant="heading-xl">{job.title}</Text>
          <div className="flex flex-wrap gap-xs mt-sm">
            <Tag size="md" variant={"blue"}>
              {job.contract_type}
            </Tag>
            <Tag size="md" variant={"green"}>
              {job.status}
            </Tag>
            <Tag size="md" variant={"teal"}>
              {job.work_mode}
            </Tag>
          </div>
        </div>
        {!bearerToken && (
          <Button as={Link} to={`/jobs/${job.id}/apply`}>
            Apply now
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-md">
        <Card>
          <Card.Body>
            <Text variant="heading-sm" className="mb-sm">
              Description
            </Text>
            <Text variant="body-md">{job.description}</Text>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Text variant="heading-sm" className="mb-sm">
              Details
            </Text>
            <div className="grid grid-cols-2 gap-y-sm gap-x-lg">
              <div>
                <Text variant="label-sm" className="text-neutral-60">
                  Contract type
                </Text>
                <Text variant="body-md">{job.contract_type}</Text>
              </div>
              <div>
                <Text variant="label-sm" className="text-neutral-60">
                  Office
                </Text>
                <Text variant="body-md">{job.office}</Text>
              </div>
              <div>
                <Text variant="label-sm" className="text-neutral-60">
                  Work mode
                </Text>
                <Text variant="body-md">{job.work_mode}</Text>
              </div>
              <div>
                <Text variant="label-sm" className="text-neutral-60">
                  Status
                </Text>
                <Text variant="body-md">{job.status}</Text>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Text variant="heading-sm" className="mb-sm">
              Applicants
              {job.applicants ? (
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Email</Table.Th>
                      <Table.Th>Full Name</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th className="text-center w-[80px]">
                        Status
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {job?.applicants.map((applicant: Applicant) => (
                      <Table.Tr>
                        <Table.Td>{applicant.candidate.full_name}</Table.Td>
                        <Table.Td>{applicant.candidate.email}</Table.Td>
                        <Table.Td>{applicant.candidate.email}</Table.Td>
                        <Table.Td>{applicant.status}</Table.Td>
                        <Table.Td className="text-center"></Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              ) : (
                <Text variant="body-xl">No Applicants Yet</Text>
              )}
            </Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};
