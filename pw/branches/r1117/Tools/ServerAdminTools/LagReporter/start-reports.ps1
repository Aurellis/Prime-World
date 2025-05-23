$exectime = [System.Diagnostics.Stopwatch]::StartNew()

$dp0 = [System.IO.Path]::GetDirectoryName($MyInvocation.MyCommand.Definition)
if ((get-location).tostring() -ne $dp0) { cd $dp0 }

if (-not (test-path "$dp0\files")) {
  md files
}

$type = 'daily'
if ($args.length -gt 0) { $type = $args[0] }

# интервал времени по которому собираются данные (не UTC)
if ($type -eq 'daily') {
  # для ежедневного отчета по умолчанию отчет строится по данным "за вчера"
  $starttime = (get-date).Date.AddDays(-1)
  $endtime   = (get-date).Date.AddSeconds(-1)
}
elseif ($type -eq 'weekly') {
  # с параметрами по умолчанию скрипт запускается только по понедельникам (костыль для шедулера)
  if ($args.count -eq 1 -and (get-date).dayofweek -ne 'Monday') { exit 1 }

  # для еженедельного - за прошедшую неделю
  $starttime = (get-date).Date.AddDays(-7)
  $endtime   = (get-date).Date.AddSeconds(-1)
}
else {
  write "'$type', davai do svidannya"
  exit 1
}

# также даты можно задать из командной строки
if ($type -eq 'daily' -and $args.length -ge 2) {
  $starttime = [DateTime]::Parse($args[1])
  $endtime   = $starttime.AddDays(1).AddSeconds(-1)
}
if ($type -eq 'weekly' -and $args.length -ge 3) {
  $starttime = [DateTime]::Parse($args[1])
  $endtime   = [DateTime]::Parse($args[2])
}


if ($type -eq 'daily') {
  $datesuffix = $starttime.ToString('yyyyMMdd')
}
else {
  $datesuffix = '{0:yyyyMMdd}-to-{1:yyyyMMdd}' -f $starttime, $endtime
}

$startdh = $starttime.tostring('yyyyMMdd')
$enddh = $endtime.tostring('yyyyMMdd')


$files = @()

# ---------------------------------------------------------------------------------------
# отчет по лагам

.\lag-reporter.ps1 $type $startdh $enddh
$file = "$pwd\files\Lag-Reports-$type-$datesuffix.xlsx"
if (test-path $file) { $files += $file }

# ---------------------------------------------------------------------------------------
# отчет по читам

<#
if ($type -eq  'daily') {
  .\cheat-reporter.ps1 $starttime $endtime $datesuffix
  $file = "$pwd\files\Cheat-Reports-$datesuffix.xlsx"
  if (test-path $file) { $files += $file }
}
#>

# ---------------------------------------------------------------------------------------
# отчет по дисконнектам

.\disconnect-reporter.ps1 $type $startdh $enddh
$file = "$pwd\files\Disconnects-$type-report-$datesuffix.xlsx"
if (test-path $file) { $files += $file }


# ---------------------------------------------------------------------------------------
# Отправка по email

$from = 'brownie@domain.com'
$to = 'pw_dev_stats@domain.com'
if ($type -eq 'weekly') {
  $to = 'pw_manage_stats@domain.com'
}
$message = New-Object Net.Mail.MailMessage($from, $to)
if ($type -eq 'daily') {
  $message.Subject = 'Отчеты за ' + $starttime.Date.tostring('dd MMMM yyyy')
}
if ($type -eq 'weekly') {
  $message.Subject = "Отчеты за неделю с $($starttime.Date.tostring('dd MMMM yyyy')) по $($endtime.Date.tostring('dd MMMM yyyy'))"
}
$message.Body = 'Отчеты сформированы автоматически за период с {0:dd.MM.yyyy HH:mm:ss} по {1:dd.MM.yyyy HH:mm:ss}' -f $starttime, $endtime
$files |% { $message.Attachments.Add($_) }
$smtp = New-Object Net.Mail.SmtpClient('edge1.domain.com')
write 'sending the email'
$smtp.Send($message)


write-host 'script executed in ' $exectime.elapsed
$exectime.stop()