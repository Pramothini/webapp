# if you want to validate data from a CSV file, you have to first construct
# a CSV reader using the standard Python `csv` module, specifying the appropriate
# dialect, and then pass the CSV reader as the source of data to either the
# `CSVValidator.validate` or the `CSVValidator.ivalidate` method

import argparse
import os
import sys
import csv
from csvvalidator import *
import re

def create_validator():
	field_names = (
					'IP',
					'DNS',
					'NetBIOS',
					'OS',
					'IP Status',
					'QID',
					'Title',
					'Type',
					'Severity',
					'Port',
					'Protocol',
					'FQDN',
					'SSL',
					'CVE ID',
					'Vendor Reference',
					'Bugtraq ID',
					'Threat',
					'Impact',
					'Solution',
					'Exploitability',
					'Associated Malware',
					'Results',
					'PCI Vuln',
					'Instance',
					'Category'
					)

	validator = CSVValidator(field_names)

	# header check
	validator.add_header_check('HEADER_CHECK_FAILED', 'bad header')

	# record length check, for every row
	validator.add_record_length_check('RECORD_LENGTH_FAILED', 'unexpected record length')

	# IP value check: '\d+\.\d+\.\d+\.\d+', with range 1~255
	ip_pattern = '^[1-2]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]\.[1-2]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]\.[1-2]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]\.[1-2]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]$'
	validator.add_value_check('IP', match_pattern(ip_pattern), 'IP_VALUE_CHECK_FAILED', 'IP must be an in format: xxx.xxx.xxx.xxx')
	
	# CVE ID value check
	

	# Severity value check
	severity_pattern = '^[1-9]?|10?$'
	validator.add_value_check('Severity', match_pattern(severity_pattern), 'SEVERITY_VALUE_CHECK_FAILED', 'Severity must be digit ranging from 1 to 10')

	return validator

max_file_size = 52428800 # 50MB

def validateCSV(inputFile):
	validateMessage = "Validate %s... " % inputFile.name
	validateCode = 0

	# check file suffix
	if not inputFile.name.endswith('.csv'):
		validateMessage += 'Failed!\nError: %s is NOT a csv file!\n' % inputFile.name
		validateCode = 1
		return validateCode, validateMessage

	# file size check
	if inputFile.size > max_file_size:
		validateMessage += 'Failed!\nError: %s size too big for processing!\nFile size limit: %dMB.\n' % (inputFile, max_file_size / (1024 * 1024))
		validateCode = 1
		return validateCode, validateMessage

	inputData = csv.reader(inputFile)
	backupData = csv.reader(inputFile)
	ignoredLines = 0

	for row in inputData:
		if row[0] == "IP":
			break
		ignoredLines += 1

	# create a validator
	validator = create_validator()

	# validate the data from the csv reader
	# ignore lines (rows) at the beginning of the data
	problems = validator.validate(backupData, ignore_lines=ignoredLines) 
 
	if problems:
		validateCode = 1
		validateMessage += "Failed!\n"
		validateMessage += writeProblemsToString(problems)

	if validateCode == 0:
		validateMessage += "Passed!"
	
	return validateCode, validateMessage

def writeProblemsToString(problems, summarize=False, limit=0):
    """
    Write problems to a string.
    """
    reportString = ""
    reportString += "\n=================\nValidation Report\n=================\n"

    counts = dict() # store problem counts per problem code
    total = 0
    for i, p in enumerate(problems):
        if limit and i >= limit:
            break # bail out
        if total == 0 and not summarize:
            reportString += "========\nProblems\n========\n"
        total += 1
        code = p['code']
        if code in counts:
            counts[code] += 1
        else:
            counts[code] = 1
        if not summarize:
            ptitle = '\n%s - %s\n' % (p['code'], p['message'])
            reportString += ptitle
            underline = ''
            for i in range(len(ptitle.strip())):
                underline += '-'
            underline += '\n'
            reportString += underline
            for k in sorted(p.viewkeys() - set(['code', 'message', 'context'])):
                reportString += ':%s: %s\n' % (k, p[k])
            if 'context' in p:
                c = p['context']
                for k in sorted(c.viewkeys()):
                    reportString += ':%s: %s\n' % (k, c[k])

    reportString += "========\nSummary\n========\n"
    reportString += "Found %s problem in total.\n" % total
    for code in sorted(counts.viewkeys()):
        reportString += ':%s: %s\n' % (code, counts[code])
    return reportString
