$data = Get-Content '.gemini_scratch\latest_run.json' -Raw | ConvertFrom-Json
$run = $data.workflow_runs[0]
Write-Output ("Run: " + $run.display_title)
Write-Output ("Status: " + $run.status)
Write-Output ("Conclusion: " + $run.conclusion)
Write-Output ("ID: " + $run.id)

if ($run.status -eq "completed") {
    $jobs = Invoke-RestMethod -Uri ("https://api.github.com/repos/ArpitSrivastav05/NARISETU/actions/runs/" + $run.id + "/jobs")
    foreach ($job in $jobs.jobs) {
        Write-Output ("`n=== Job: " + $job.name + " | Conclusion: " + $job.conclusion + " ===")
        foreach ($step in $job.steps) {
            $icon = switch ($step.conclusion) { 'failure' {'FAIL'} 'success' {'PASS'} 'skipped' {'SKIP'} default {'????'} }
            Write-Output ("  [$icon] Step $($step.number): $($step.name)")
        }
    }
}
