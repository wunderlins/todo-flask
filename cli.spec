# -*- mode: python -*-

block_cipher = None


a = Analysis(['bin/httpd'],
             pathex=['lib/', 'lib/site-packages/', 'lib/site-packages/flask_sqlalchemy', 'lib/site-packages/email', '/home/wus/Repos/todo-flask'],
             binaries=None,
             datas=None,
             hiddenimports=['message'],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          exclude_binaries=True,
          name='cli',
          debug=False,
          strip=True,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=True,
               upx=True,
               name='cli')
