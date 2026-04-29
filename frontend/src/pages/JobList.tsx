import { Link, useNavigate } from "react-router-dom";
import { Button } from "welcome-ui/Button";
import { Text } from "welcome-ui/Text";
import { Card } from "welcome-ui/Card";
import { Tag } from "welcome-ui/Tag";
import { Loader } from "welcome-ui/Loader";
import { logout } from "../api/logout";
import { useJobs } from "../hooks/useJobs";
import { useDeleteJob } from "../hooks/useDeleteJob";
import { useJobSearch } from "../hooks/useJobSearch";
import { SearchJobs } from "./SearchJobs";
import { useMe } from "../hooks/useUser";

export const JobList = () => {
  const {
    form,
    setField,
    searchParams,
    hasActiveFilters,
    handleSearch,
    handleReset,
  } = useJobSearch();
  const { data: jobs = [], isLoading, isError } = useJobs(searchParams);
  const { user, hasBearerToken, isLoading: userLoading, clearUser } = useMe();
  const { mutate: handleDelete } = useDeleteJob();
  const navigate = useNavigate();


  if (isLoading || userLoading) return <Loader size="md" />;
  if (isError)
    return <Text color="red">Something went wrong loading jobs.</Text>;

  return (
    <div className="p-xl max-w-1200 my-0 mx-auto">
      <div className="flex items-center justify-between mb-lg">
        <Text variant="heading-xl">Job Listings</Text>

        {hasBearerToken ? (
          <div className="flex items-center gap-sm">
            {user ? (
              <>
                <Text variant="body-sm">{user.email}</Text>
                <Button
                  size="sm"
                  variant="tertiary"
                  onClick={async () => {
                    try {
                      await logout();
                    } catch {}
                    clearUser();
                    navigate("/signin");
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Loader size="sm" />
            )}
          </div>
        ) : (
          <div className="flex gap-sm">
            <Button as={Link} to="/signup" size="sm">
              Sign up
            </Button>
            <Button as={Link} to="/signin" size="sm" variant="tertiary">
              Sign in
            </Button>
          </div>
        )}
      </div>

      {!user && (
        <SearchJobs
          form={form}
          setField={setField}
          hasActiveFilters={hasActiveFilters}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      )}
      <div className="flex flex-col gap-md">
        {user && (
          <div className="flex items-center justify-end gap-sm">
            <Button as={Link} to="/jobs/new" size="sm">
              Create a new job
            </Button>
          </div>
        )}
        {jobs.length === 0 && (
          <Card>
            <Card.Body>
              <Text>No Jobs Found</Text>
            </Card.Body>
          </Card>
        )}
        {jobs.map((job) => (
          <Card key={job.id} size="sm">
            <Card.Body>
              <div className="flex items-start justify-between gap-md">
                <div className="flex-1 min-w-0">
                  {user ? (
                    <Link
                      to={`/jobs/${job.id}`}
                      className="no-underline hover:underline"
                    >
                      <Text variant="heading-md">{job.title}</Text>
                    </Link>
                  ) : (
                    <Text variant="heading-md">{job.title}</Text>
                  )}
                  <Text variant="body-sm" className="mt-xs" lines={2}>
                    {job.description}
                  </Text>
                  <div className="flex flex-wrap gap-xs mt-sm">
                    <Tag size="md" variant="blue">
                      {job.contract_type}
                    </Tag>
                    <Tag size="md" variant="light-green">
                      {job.work_mode}
                    </Tag>
                    <Tag size="md" variant="light-blue">
                      {job.office}
                    </Tag>
                    <Tag size="md" variant="green">
                      {job.status}
                    </Tag>
                  </div>
                </div>
                <div className="flex gap-sm">
                  {!user && (
                    <Button as={Link} to={`/jobs/${job.id}/apply`} size="sm">
                      Apply
                    </Button>
                  )}
                  {user && (
                    <Button as={Link} to={`/jobs/${job.id}/update`} size="sm">
                      edit
                    </Button>
                  )}
                  {user && (
                    <Button
                      size="sm"
                      variant="tertiary-danger"
                      onClick={() => handleDelete(job.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};
