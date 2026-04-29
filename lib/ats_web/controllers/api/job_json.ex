defmodule AtsWeb.Api.JobJSON do
  @moduledoc "JSON rendering for Job resources."

  alias Ats.Jobs.Job
  alias Ats.Professions.Profession

  @doc """
  Renders a list of jobs.
  """
  @spec index(%{jobs: [%Job{}]}) :: %{data: [map()]}
  def index(%{jobs: jobs}) do
    %{data: for(job <- jobs, do: data(job))}
  end

  @doc """
  Renders a single job.
  """
  @spec show(%{job: %Job{}}) :: %{data: map()}
  def show(%{job: job}) do
    %{data: data(job)}
  end

  @spec data(%Job{}) :: map()
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
      inserted_at: job.inserted_at,
      updated_at: job.updated_at
    }
  end

  @spec profession_data(%Profession{} | nil | term()) :: map() | nil
  defp profession_data(%Profession{} = profession) do
    %{
      id: profession.id,
      name: profession.name,
      category_name: profession.category_name
    }
  end

  defp profession_data(_), do: nil
end