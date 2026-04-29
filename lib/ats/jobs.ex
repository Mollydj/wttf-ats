defmodule Ats.Jobs do
  @moduledoc """
  The Jobs context.
  """

  import Ecto.Query, warn: false
  alias Ats.Repo

  alias Ats.Jobs.Job
  alias Ats.Professions.Profession

  @contract_types %{
    FULL_TIME: "Full-Time",
    PART_TIME: "Part-Time",
    TEMPORARY: "Temporary",
    FREELANCE: "Freelance",
    INTERNSHIP: "Internship"
  }

  @doc """
  Returns a job contract type.

  ## Examples

      iex> contract_type(%Job{contract_type: "FULL_TIME"})
      "Full-Time"

  """
  @spec contract_type(%Job{}) :: binary() | nil
  def contract_type(job) do
    @contract_types[job.contract_type]
  end

  @doc """
  Returns a job profession name.

  ## Examples

      iex> profession_name(%Job{profession: %Profession{name: "Software Engineer"}})
      "Software Engineer"
  """
  @spec profession_name(%Job{}) :: binary()
  def profession_name(%Job{profession: %Profession{name: profession_name}}) do
    profession_name
  end

  def profession_name(_job), do: ""

  @doc """
  Returns the list of jobs.

  ## Examples

      iex> list_jobs()
      [%Job{}, ...]

  """
  @spec list_jobs() :: [%Job{}]
  @doc """
  Returns the list of jobs, optionally filtered by search parameters.

  ## Supported params

  - `"title"` — case-insensitive partial match on job title
  - `"office"` — case-insensitive partial match on office location
  - `"work_mode"` — exact match on `:onsite | :remote | :hybrid`
  - `"contract_type"` — exact match on contract type enum
  - `"profession_id"` — exact match on profession foreign key
  - `"status"` — exact match on status enum (defaults to published when absent)

  """
  @spec list_jobs(map()) :: [%Job{}]
  def list_jobs(params \\ %{}) do
    Job
    |> join(:left, [j], p in assoc(j, :profession), as: :profession)
    |> filter_by_title(params)
    |> filter_by_office(params)
    |> filter_by_work_mode(params)
    |> filter_by_contract_type(params)
    |> filter_by_profession(params)
    |> filter_by_status(params)
    |> order_by([j], desc: j.inserted_at)
    |> preload([j, profession: p], profession: p)
    |> Repo.all()
  end

  defp filter_by_title(query, %{"title" => title}) when is_binary(title) and title != "" do
    where(query, [j], ilike(j.title, ^"%#{title}%"))
  end
  defp filter_by_title(query, _), do: query

  defp filter_by_office(query, %{"office" => office}) when is_binary(office) and office != "" do
    where(query, [j], ilike(j.office, ^"%#{office}%"))
  end
  defp filter_by_office(query, _), do: query

  defp filter_by_work_mode(query, %{"work_mode" => work_mode})
       when is_binary(work_mode) and work_mode != "" do
    where(query, [j], j.work_mode == ^work_mode)
  end
  defp filter_by_work_mode(query, _), do: query

  defp filter_by_contract_type(query, %{"contract_type" => contract_type})
       when is_binary(contract_type) and contract_type != "" do
    where(query, [j], j.contract_type == ^contract_type)
  end
  defp filter_by_contract_type(query, _), do: query

  defp filter_by_profession(query, %{"profession_id" => profession_id})
       when is_binary(profession_id) and profession_id != "" do
    where(query, [j], j.profession_id == ^profession_id)
  end
  defp filter_by_profession(query, _), do: query

  defp filter_by_status(query, %{"status" => "all"}), do: query
  defp filter_by_status(query, %{"status" => status})
       when is_binary(status) and status != "" do
    where(query, [j], j.status == ^status)
  end
  defp filter_by_status(query, _) do
    where(query, [j], j.status == :published)
  end

  @doc """
  Gets a single job.

  Raises `Ecto.NoResultsError` if the Job does not exist.

  ## Examples

      iex> get_job!(123)
      %Job{}

      iex> get_job!(456)
      ** (Ecto.NoResultsError)

  """
  @spec get_job!(integer() | binary()) :: %Job{}
  def get_job!(id), do: Repo.get!(Job, id) |> Repo.preload(applicants: [:candidate])

  @doc """
  Creates a job.

  ## Examples

      iex> create_job(%{field: value})
      {:ok, %Job{}}

      iex> create_job(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec create_job(map()) :: {:ok, %Job{}} | {:error, Ecto.Changeset.t()}
  def create_job(attrs \\ %{}) do
    %Job{}
    |> Job.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a job.

  ## Examples

      iex> update_job(job, %{field: new_value})
      {:ok, %Job{}}

      iex> update_job(job, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec update_job(%Job{}, map()) :: {:ok, %Job{}} | {:error, Ecto.Changeset.t()}
  def update_job(%Job{} = job, attrs) do
    job
    |> Job.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a job.

  ## Examples

      iex> delete_job(job)
      {:ok, %Job{}}

      iex> delete_job(job)
      {:error, %Ecto.Changeset{}}

  """
  @spec delete_job(%Job{}) :: {:ok, %Job{}} | {:error, Ecto.Changeset.t()}
  def delete_job(%Job{} = job) do
    Repo.delete(job)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking job changes.

  ## Examples

      iex> change_job(job)
      %Ecto.Changeset{data: %Job{}}

  """
  @spec change_job(%Job{}, map()) :: Ecto.Changeset.t()
  def change_job(%Job{} = job, attrs \\ %{}) do
    Job.changeset(job, attrs)
  end
end
