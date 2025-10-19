import requests

def download_pdb(pdb_id):
    url = f"https://files.rcsb.org/download/{pdb_id}.pdb"
    r = requests.get(url)
    if r.status_code == 200:
        return r.text
    raise Exception("PDB not found")





pdb_id = "1TUP"  # replace with the PDB ID you want
pdb_content = download_pdb(pdb_id)
print(pdb_content[:500])  # prints first 500 characters of PDB file
