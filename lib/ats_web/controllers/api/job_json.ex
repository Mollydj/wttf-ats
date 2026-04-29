defmodule AtsWeb.Api.JobJSON do
  @moduledoc "JSON rendering for Job resources."

  alias Ats.Jobs.Job
  alias Ats.Professions.Profession

  @spec index(%{jobs: [%Job{}]}) :: %{data: [map()]}
  def index(%{jobs: jobs}) do
    %{data: for(job <- jobs, do: data(job))}
  end

  @spec show(%{job: %Job{}}) :: %{data: map()}
  def show(%{job: job}) do
    %{data: data(job)}
  end

  defp data(%Job{} = job) do
    %{
      id: job.id,
      title: job.title,
      description: job.description,
      contract_type: job.contract_type,
      office: job.office,
      status: job.status,
      work_mode: job.work_mode,
      profession_id: job.profession_id,
      profession: profession_data(job.profession),
      applicants: applicants_data(job.applicants),
      inserted_at: job.inserted_at,
      updated_at: job.updated_at
    }
  end

  defp profession_data(%Profession{} = profession) do
    %{
      id: profession.id,
      name: profession.name,
      category_name: profession.category_name
    }
  end

  defp profession_data(_), do: nil

  defp applicants_data(%Ecto.Association.NotLoaded{}), do: []

  defp applicants_data(applicants) do
    Enum.map(applicants, fn applicant ->
      %{
        id: applicant.id,
        application_date: applicant.application_date,
        status: applicant.status,
        salary_expectation: applicant.salary_expectation,
        candidate: candidate_data(applicant.candidate)
      }
    end)
  end

  defp candidate_data(candidate) do
    %{
      id: candidate.id,
      full_name: candidate.full_name,
      email: candidate.email,
      phone: candidate.phone,
      last_known_job: candidate.last_known_job
    }
  end
end