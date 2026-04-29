import { Link } from "react-router-dom";
import { Button } from "welcome-ui/Button";
import { Text } from "welcome-ui/Text";
import { InputText } from "welcome-ui/InputText";
import { Textarea } from "welcome-ui/Textarea";
import { Select } from "welcome-ui/Select";
import { Field } from "welcome-ui/Field";
import { Card } from "welcome-ui/Card";
import { Hint } from "welcome-ui/Hint";
import { Link as WUILink } from "welcome-ui/Link";
import { useState, FormEvent } from "react";
import { useUpdateJob } from "../hooks/useUpdateJob";
import { useJob } from "../hooks/useJobs";
import { useParams } from "react-router-dom";

const CONTRACT_TYPE_OPTIONS = [
  { label: "Full Time", value: "FULL_TIME" },
  { label: "Part Time", value: "PART_TIME" },
  { label: "Temporary", value: "TEMPORARY" },
  { label: "Freelance", value: "FREELANCE" },
  { label: "Internship", value: "INTERNSHIP" },
  { label: "Apprenticeship", value: "APPRENTICESHIP" },
  { label: "VIE", value: "VIE" },
];

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Filled", value: "filled" },
  { label: "Archived", value: "archived" },
  { label: "Cancelled", value: "cancelled" },
];

const WORK_MODE_OPTIONS = [
  { label: "On-site", value: "onsite" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
];

export const UpdateJob = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const { data: job, isLoading, isError, error } = useJob(jobId);

  const { mutate: handleUpdate } = useUpdateJob(jobId);
  const [title, setTitle] = useState(job?.title);
  const [description, setDescription] = useState(job?.description);
  const [contractType, setContractType] = useState(job?.contract_type);
  const [office, setOffice] = useState(job?.office);
  const [status, setStatus] = useState(job?.status);
  const [workMode, setWorkMode] = useState(job?.work_mode);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleUpdate({
      title,
      description,
      contract_type: contractType,
      office,
      status: "published",
      work_mode: workMode,
    });
  };

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

      <Text variant="heading-xl" className="mb-lg">
        Create New Job
      </Text>

      <Card style={{ overflow: "visible" }}>
        <Card.Body style={{ overflow: "visible" }}>
          {isError && (
            <Hint variant="danger" className="mb-md">
              {error.message}
            </Hint>
          )}

          <form onSubmit={handleSubmit}>
            <Field label="Title" required className="mb-md">
              <InputText
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />
            </Field>

            <Field label="Description" className="mb-md">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                minRows={4}
                disabled={isLoading}
              />
            </Field>

            <Field label="Contract Type" required className="mb-md">
              <Select
                name="contract_type"
                value={contractType}
                options={CONTRACT_TYPE_OPTIONS}
                onChange={(value) => setContractType(String(value))}
                disabled={isLoading}
              />
            </Field>

            <Field label="Office" required className="mb-md">
              <InputText
                value={office}
                onChange={(e) => setOffice(e.target.value)}
                placeholder="e.g. Paris, Remote, London…"
                required
                disabled={isLoading}
              />
            </Field>

            <Field label="Status" className="mb-md">
              <Select
                name="status"
                value={status}
                options={STATUS_OPTIONS}
                onChange={(value) => setStatus(String(value))}
                disabled={isLoading}
              />
            </Field>

            <Field label="Work Mode" className="mb-md">
              <Select
                name="work_mode"
                value={workMode}
                options={WORK_MODE_OPTIONS}
                onChange={(value) => setWorkMode(String(value))}
                disabled={isLoading}
              />
            </Field>

            <Button type="submit" disabled={isLoading} isLoading={isLoading}>
              {isLoading ? "Updating..." : "Update Job"}
            </Button>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};
