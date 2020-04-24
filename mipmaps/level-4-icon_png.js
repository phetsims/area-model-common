/* eslint-disable */
import SimLauncher from '../../joist/js/SimLauncher.js';
const mipmaps = [
  {
    "width": 150,
    "height": 196,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAADECAYAAAB9R9geAAAAAklEQVR4AewaftIAADQVSURBVO3BDXxU9YHo/d9/ZkJeZzgQEmMYzEEC5KVLjhK84TELh7iF+HgfMmi0dhdkAu1FWndJ6ue61OqTHEUf9F43YZe7lG2RIOltKVQSu14DtTBQvKSXqBMq4S2WiQwRCZBxJuQFQs4zsZuW0gCTF2Am5PtlxIgRI0aMGDFixIgRI0aMGDFixIgQIBgRUnRdl4BCoFwI4SJImRgRMnRdtwGlngvIUjQZwAKClGBE0NN1XQY2ei6gFv1Qp3K/zolNBqRo5gghHAQhEyOClq7rElAIFJdV6mgVOp5WvqJV6JQuExuBiQQhIyOCkq7rNmC74yC2BS91s+lX0HGRP6o5Arb/S0g/XFMiNE1zEGQEI4KKrusysNFzAbXohzrlv9K5FnWaYPfrwgPcJ4RwEURMjAgKuq5LQCFQXFapo1XoeFq5LsdBnfJfIdm/LkqBBQQRIyNuO13XbcB2x0FsC17qZtOvoOMiAdnzO3j6EZGy+pWSPZqmuQgSJkbcNrquy8BGzwXUoh/qlP9Kp788raBV6JQuExuBiQQJwYhbTtd1CSgEissqdbQKHU8rg/LxvxpQ7kUTQpQQBIyMuKV0XbcB2x0HsS14qZtNv4KOiwza0ZNg/7pQSkpKtmia5uE2MzHiltF1vdRzgcKiH+qU/0pnKDkO6pT/Csn+dVEKLOA2MzDiVtqEn+Ogzs1QtF7HcwGbrusqt5mBEbeMEMIpRVNW+rTgZvC0glah47eR28zAiFtNs80UHnWa4GYo267j/D2yrusl3EZGRtxSmqZ1lJSUfKFOE7Y1lTo3w9GTYP+6UEpKSrZomubhNjAw4pYTQpTLd+EoWSi4GRwHdcp/pUtAKbeJgSGk67qs67rEiEAUrVggkO/ipihar+O5gE3XdZXbwMAQ0XVdAj4GPtZ1XWXEdQkhnFI0ZaVPC24GTys4Dur4beQ2MDB0Sj/89TmpYvXv5TZf125d17frui4x4no020zhUacJhpIyCXa/bsA2U7iAIm4DI0NA13W1zddV9or9dxw+8CW/3nKaxIlRKYn3Rj1dUlLyhaZpTkb8BU3TOkpKSr5QpwnbmkqdwZJi4P9bIih/1oB8FxpQIIRwchsIhoCu6ycqVv9ert58iiulzhjNslemMG58hAMoEEK4GPEXdF3frVXoakmFzkDZvy4ofVogReMACoQQLm4jI4Ok63pJ45ELtn/7wTGudrapk72VZ7h0UZdTZ4wuLCkpEZqmORjxZ0pKSuqUSeLpLXt0PBfoF2US/PT7BgoXCFfEKAqEEN/XNM3DbSYYBF3XZeDEDx77iMYjF7iepJRoFq6cROqM0S6gQAjhYMQf6bpeWrlfL1yg6QRCioHihYJCm8BPA8qEEB6ChInB2Vi9+RSNRy5wI41HLvCK/SC5i8bLj373nt26rpcDRUIIDyN6aLaZwq5OQ3Ic1Lke+9cFpU8LpGgcQIEQwkWQEQyQruv2s6c6Nj7/2Me0+brojyiziWWvTGH6Q7EeoEgIUc4IdF23u75g48TF3fRFmQSlywyo03ABRUKISoKUYAB0XZeAE6X/UC99+OtzDFTqjNEse2UK48ZHOIACIYSLO5yu67u1Cl0tqdDpJcVA8UJBoU3gpwFlQggPQczIAJSUlKz78Nfnst7+188YjLNNneytPMOli7qcOmN0YUlJidA0zcEdrKSkpE6ZJJ7eskfHcwHsXxe894oBdZpwAHOEEJWapnUQ5AT9pOu62ubr2v2Dxz6m+VQHQyUpJZqFKyeROmO0CygQQji4Q+m6Xuo4SCF+6jRcQJEQopIQYqD/St/+H5/RfKqDodR45AKv2A/y4a/PyUApdzZNnYZHnYYG3CeEqCTEmOgHXddLGo9cUKo3n+JmiBsfQeoDo/Er4g4mhPAAYwhhJgKk67oMrPi3HxzlZln4j/cSZTaVCSEc3Foq1+YCXIzoFxOB21i9+ZTUeOQCN8P0h2KZ/lCsB9C4OSRABRQgA5ABBT9rnJmoiDD6cvKMl/bOLvw8gBNwAnWAE3Ayok8mAqDruu3sqQ717f/xGTdDlNnEon+8F78CIYSHoaMAiwEVUKZMGIs1zow1zkzs6EgmW8cQqHPedum8t0M9dvK86m72cezkedo7u1yAA6gCKhnxRyZuQNd1Cdi4+bXf0+br4mZ49Lv3MG58hEMIUcngyYAdWBxriZQzkuOZbB1DRnI8gxFriSTWEslk6xh6uZt9cl3DGXtdwxm7u9nnASqBNYCTO5yJGys+fOBL6cNfn+NmSEqJJnfReA9QwOBIQClgz0pPJGNSPBnJ8dxM1jgz1jgzj8ychLvZJ9UcarLvP3TK3t7Z5QA0wMEdysgNlJSURMaNj8hKfUCSjhz4kjZfF0PpufV/hTRu1GtCiEoG5/Os9MSsZXkKM9PHkzA2mlvJEh1OmjyOWRkTSBgbLbubffb2zi4VaARc3GGM3ICmaUdKSko2xY2PiJhluysrLNzI4QNfMhRyF41nlu0upxDimwze6ucXzSQqPIzbKcxkwBpvJuf+JCLDTfKJz7+0d13uVoDfAh7uEEYCoGlah6ZpO1559aU9qTNGK9MfGpfw+Yk2zjZ1MlBx4yN45r+nEBZu+KamaS4GryTn/iTCTAaCxcS7JWZlTKDrcnfKic+/tAOdQA13ACP9oGmaS9O09aVrXxGzbHcpURZTREOdj0sXu+mvZa9MISklpkwIsZ7BUwF7wthorPFmgkmYyUCaPI4pE8ZGHD/Zktve2aUCVUAHw5iRAdA0zVFSUrIlOcOiPPSNu+WmE+18fqKdQE1/KJZHv5vkARZomtbB4EjAe1npidKUCWOJtUQSjGItkcxMH0/X5W75xOdfPg38FnAxTAkGSdd1G7Dx8IEvpX/7wTGaT3VwPVFmE6/+4j7GjY9YIISoZHBkoDQjOd62bL5Cj3PedmItkQSzmkNNbHUcob2zqwgoYxgyMkiaph0pKSlZHzc+ImKW7a6sS506DQd9XMs3viczLXusQwjxfQbODuwGVk6ZMDZl6SPTCDMZ6HGquZXjJ1uwxpsJVtZ4M+kTx1F79HRu1+VuGahimDEyBDRN69A0bccrr760Z1r2GGX6Q+MSPj3o5cuzl7hSUko0y16Z6gEe1jTNw8DIwPZl8xVp6SPTyEpPJMxkoNd5bwc19U1kTk0gmFmiw5mVMYF611nF23ZRBqoYRowMIU3TXJqmrS9d+4p46Bt3K1EWU0RDnY9LF7vp8dz6v0IaN+o1IUQlA7c95/6klJz7k+jLeW8Hlb85TlZ6IlHhYQSzMJOBzJS7qXedVbxtF2WgimHCyE2gaZqjpKRkS3KGRZn5cJzc3NRJRvZYZtnucgohvsnAqZHhppKn8+4jzGSgh7vZhyU6nF7nvR3UHGoi1hLJxLslgl2YyUBmyt3Uu84q3raLMlDFMGDkJtE0zaNp2qbX31hVN/PhuNxp2WMigG9qmuZi4Dba/nqyPGXCWHq0d3bx4o9/Q1Z6IlHhYfQ47+2g5lAT3gsX+euMCYSCMJOBzJS7qXedVbxtF2WgihBn5CbTNO1ISUnJeuC3QohqBs4ea4ksXPrINHp9ePQ0CPjraRPodd7bAWGjcZ9pIeWeMViiwwkFYSYDmSl3U+86q3jbLkrADkKYIHTsfmre19Ss9ER6rX/HScakeLLSE+l13N3C/mOtWBPiOH+mkXx1KqHE3eyj9OcHaO/sKgDKCVEGQoMaa4lUs9ITudKxk+eZPGEMfVman0tdwxlCjTXOTNETM/DbCCiEKAOhYUVWeiJXcjf76BFriaQvaclJREbF4G72EWqscWaemvc1/HYDEiHIRPCTAVvO/UlcyX3Gx4R4C9czN3s6NYcOk69Opb/aO7twN/s492U757zt9DjubuFqx06ep0dkuIkJ8RauFBluwhpnpkesJZLY0ZGMtUQQa4nkRrLSEznmPi/VHGraDswhxJgIfiuy0hOJDDdxpXPediZbx3A9j+fOYuH39pCvTuV6znnbOX6yBXezD3ezj2Mnz9MjS0nFEhNN+tSp9LA9cg+WmGiulJachCUmCvfpZtynz3KlGudhfvjTKnLuT6KmvokeJ894ae/swhpnJnZ0JNY4M1MmjMUaZyYy3MSVHldTOH6yRT3nbS8EygghJoKfbWb6eK523N1CVloiffG2ttEjLTmJyKgY3M0+rHFmerV3dlHXcIZj7vPUNZwhLGwUWUoaGdOmskxJxZowDmtCHIHYua+W+obPsMREkZ87C0tMFL3SkpMoLf8FOfcn8cjMSfQq21rLsZPnNXezz1PXcCbp3f2fKoBqjTNjjTczxTqWyRPGEGuJZFmewqub95cCDsBJiDAR3Gyxlkh5snUMfYkdHcnVJlvHUPrzA/Samz2dmkOHmXP/PdQ1nKHmUBPuZh9zszOZN+chiotSSUtOYiB27qvl2dXrWZr/MDv21bJhWzUf/KyMXpaYKLKUVOoazpCVnkivydYxHDt5fjRQwhXczT7V3exTaw41zQZUa5yZKRPGkpEcT13DmY3AfYQIE8EtLyM5nr4cO3meZfMVbmRedib2X77Pro8amZudSdHSv2VudiaWmCgGa252Jr/790x6FPIo3tY2rjYvO5PK6h1kpSfSa8qEsby7/1OVv+QAHPwHd7PP5m72zQZsgAKUACWEABPBzZaVnsi1RIab6EusJZL6hkbSkpPIUlJ57tvfJD93Ftuq9/Ls6vXAenp88LMyrAlxDBVLTBRXm5s9HW3tZto7u4gMN9HDGmfGTwEkwMO1VQKVQBGgAnmECBPBS4m1RErWODNXO+5uIdYSSV9qDjVxqVtgiYmi15L8XOobGikt/wXv/fhV0pKT8La2YYmJYijUNzTSIy05iatZE+KYm53Jro8aeWTmJHpEhpuwxplxN/tUoJLAOAAHIcJA8LJlJMdzLbGjI7lazaEmKj/4PVvKXsCaEMeVdu77kLnZmaQlJ+FtbWOoeFvbePhbz/Pwt56nrPxt+rI0P5ddHzXS3tlFr4zkePzyGKYMBK/Zk61jCFTNoSYqP/g9W8peIC05iatlKak8njsL9+lmHnxyBX/1n7/Ntuq9DFZ9QyNCCEwmI6Xlv8Db2sbVspRU/nqGwlbHEXplJMfjZ2OYMhC81CkTxtKXk2e8jLVE0Mvd7GOr4whvrFxGWnISfclSUslSUnGfPovvQjsmkxFt7Wbcp5sZjCwlFV3XEUJgMAh27qulL2+sXEZ9o4e3dnxCe2cX1jgzsZZICVAZhgwEJzXWEklkuIm+tHd2EWuJpIe72Ufpzw+wqmgpc7MzCZQQgta2Dnbu+5DBmpudyeXL3QghcJ8+S18sMVG89+NXIWw0pT8/QHtnFxnJ8fgtZhgyEJwUa7yZG2nv7OKt6k/45v/zN+TnziIQWUoq5uhIdB2EEOzYV8tgFT+zkJioCC5f7iYt+R6uxZoQx5ayF8iafh+lPz9AVnoifjaGISPBKTdzaoI6ZcJY+nLc3UKP3xx0M1GexBsrl9EfFy92sf/jeoQQjL8rlsdzZ3Ej9Q2NPP9PG0m+J5Hn/2kj83Nm0ssSE83C+X/D/JyZZClp3Mi87ExqDh7nyAk3fhHetouNgJNhxEBwmm2NM3M9uz5q5BKRvLFyGf21JD+X/5SRwuXLl1man0sgrAlxuE838/C3nqfGWU99QyNXssREkZacRKDeWLmM+kYPGcnx+K1gmDESnOyzMibIsZZI+nLc3UK96xwL5/8Nsx+YRn+Fjwrj8dxZFNkfY9I9iQQifFQYC+c/RJH9MZrPf0l9QyPqAxkMVPioMJrPf8lnp05xztue0HW5ew/gYpgwEJxUa5yZa7HGmYm1RLLfWc/tMC87k/qGRgZrXnYmx0+2kHN/En7FDCMGglRkuIlriR0dybI8hRrnYbytbdxq3tYLDIUsJZVz3nZy7k8iMtykAirDhIEQZI0zY40zk5Ecz859tdxq7tNnmZedyVCwJsThbvbxyMxJ+BUzTBgIYRmT4tmwrZpbbUl+LkvycxkK1oRxtHVcIuf+JGItkSpgZxgwEMKy0hM5cfIUNc7DhKqZShruZh89nsr9Gn6lgESIMxDicu5PYmv1XoaDydYxZCTHS8BGQpyBEJdzfxLv7v7f1Dc0Mhw8Ne9rxFoibYCdEGYiODmPu1uUydYx3EhkuImc+5PQ1m5mS9kLDIa3tY36hkZ6eFsvUN/wGb32O+u5mre1jfqGRq6WnzuLN1YuIxCWmCjOedvpFRluYlmewqub95cCTsBJCDIRnDxtHZcIVM79Sbzw473s3FfL3OxM+svb2saDT67A29qGqqr0UlWVXv+YtxBJkriaqqr0cjqd3HfffRTZH2UwrHFmnpr3NemtHZ/sBiYCHkKMieC0x93sUzOS4wlEZLiJx9UUtLUVZClpWGKi6A9LTBQ/WvU9vlG4isWLF2O32+kvj8dDQUEBRfbHsCbEEShvaxuxlkiulpWeyDH3eanmUNNuYA7gIYQYCU6yEMKWlZ5IoKzxZj48coqms17UBzLoL2tCHBMS4vjOf30RSZLIysoiUB6Phzlz5pCcYKH4mUX0R43zMOfOnWbKhLFcLSM5nnPe9gR3sy8X2AJ0ECKMBCdPW+elwnkPTKQ/Jk8Yw7qte5kycQKT7kmkv9KSk5iXncn3X/5v/PLd/4WqqkiSxPVUVlYyZ84cMlPu4Y2Vy+ivHftqueA7z5QJY+lLRnI857ztCe5mXy6wA/AQAowEJ0/X5W57RnK8ZIkOJ1BR4WEkjI3mjc07UR/IIG6sRH/FjZV4PHcWp5ua+C9/X8TOX72Px+Oho6MDWZbxeDzU1NRQWVnJ8uXL+cWW/8krhYv5zt/OZyDW/c9fotw7mlhLJNeSkRxPe2dXwonPv7QDvwVcBDlB8NqYr06159yfRH+9u/9T6k54ee/Hr2KJiWKgvK1t7NxXy459H+I+3Ux9QyM9spRUrAlxzMueztzsTAbjr/7zt/mvT04n1hLJjdQcamKr4wjtnV0aUEIQEwQvmzXOvP35RTMZiLd2fIK3M4wtZS9giYkiGNU3NPLod/9f3vhuDoE6521n845DHDt53gVoQDlByEjwOu1tu7gyKz2RqPAw+isjOZ4jrtP85N0PmJ8zk/BRYQSbX+6qobm5icypCQQqKjyMrPREYi2R0jH3eVvX5W4ZqCLIGAheHqC8ruEMA/XUvK9hCb/ENwpX4T7dTLDZWr2XjEnxDFR7Z5cH0AhCBoJb1e6PPmMwnpr3NSzhl3j4W89T39BIsHCfbubEyVNkJMfTX+5mH1sdR/ArAFwEISPB7Uh7Z5d9yoSxUqwlkoHKSI4nJsLEc6U/ZXRMNPelJXO7aWsriDJ1kjk1gf5wN/so/fkB2ju7CoCfEaSMBL8x7Z1daubUBAbDGm8mIzme8qq97PzfTmYqqVhiorkd3KebeWntZuwPpxMVHkag3M0+Sn9+gPbOrjLgNYKYkeDn/OL8haez0hMjosLDGAxLdDiZKXfjOnWGF/9lCwJBWnIS4aPCuJW0tRWEizZmpo8nUO5mH6U/P0B7Z1c5sJwgZyT4dQAp7Z1dSkZyPIMVZjKQJo8jIzmeqt21/HPFvxM/VsKaEEf4qDButhrnYf7bj37K3z86nTCTgUC4m32U/vwA7Z1dGlBECDASGurczb7CrPREosLDGAqW6HAykuP57AsPb72zl1/uqmFe9nQsMdHcLN7WNmzfKeaxWZOZePdoAlFzqIm1b39E1+XuAqCMEGEkNHgAcd7boWZOTWCw2ju72HngBBvePYh1vJXiZxbx6veWYImJJlD1DY18XN/ApHsSCZTtO8VYY0fxyMxJ3Eh7Zxc//XU97+7/1APMBKoJISZCR1ldw5kVx90t0mTrGAaq5lATWx1HyEidTPlrK8lSUgnEw996niwllXnZmdQ4D7Nh23sU2R8jUM+uXo/3y/MsfWIGN3Lc3cJb1Z9wztvuABYAHm4BXdclQBJCuBgkE6HDA6zZuvtI8fOLZtJf7mYfb1V/AsYIyl9bSZaSSn8UP7OIrdV7KS3/BdaEOH606ntkKanciLe1DW3tZmo+/JiiJ2YQGW7iWto7u3h3/6fs+qjRA2hAGbeArusSUAisAJzAHAZJEHpO5KtT5Zz7kwjUu/s/5Te/+5yl+Q9TaH+UW8V9uplvv1BKV6ePZfMVIsNNXMuujxp5d/+ntHd2VQJFgIubTNd1GVgB2N1V5ZKrYg3/6c3dhJmlOUIIB4NgIvQUvLv/090ZyfHEWiK5nnPedtZXOXE3+8jPnUWh/VFulZ37anl29Xoyp8SRr2ZyLTWHmnh3/6ec87a7gALAwU2m67oMFAN2d1U5x9dptDe56OGqWMPk5cXFgINBEISm0ikTxhYWPp7JtdQ1nOGtHZ+Qc38SGcnxvFX9CdbxVt5YuQxrQhw3i/t0M9raCn5zwMlT875GRnI8fak51MS7+z/lnLfdBWhAOTeZrusyUAzY3VXlHF+n0d7k4kphZgm1+gRhZmmOEMLBAJkITdqxk+dtuz5qlHPuT+JqNYea2Oo4wuNqClnpifQoemIG7+7/lIe/9TxL8x+m0P4oQ8l9upnS8rfZVr2XnPuTWPWtWUSGm7jSOW87NYea2PVRI+2dXU5gDVDOTabrugwUA3Z3VTnH12m0N7noyyWfB1fFGiYvLy4GHAyQIHSpkeGm3UVPzMAaZ6ZXXcMZ3trxCUVPzMAaZ+Zqx90tvLv/U9ouGSmyP8rc7EwsMVEMhrZ2M29uqyYrPZFHZk4i1hJJr/bOLuoazlD36RnqGs7gVw5sAhzcZLquy0AxYHdXlXN8nUZ7k4sbCTNLqNUnCDNLc4QQDgbAROhytHd2aW9Vf1Jc9MQMIsNNtHd28daOT3hcTcEaZ6Yvk61jKHw8k7qGM6z/yVa0tZtZmv8whfZHGYj6hkaqdu7h5W/9NbGWSHq0d3ZR13CGY+7z1DWcob2zywlsAsoBDzeZrusyUAzY3VXlHF+n0d7kIlCXfB5cFWuYvLx4BeBgAAShb3dWeqL61LyvseujRo67W1g2XyFQ7mYfa7fX8bt//xEDUVb+NnUHa8lKT+TYyfMc/LSZYyfP4+cENgGVgItbQNd1GSi+5PPYT1WVc6JiDe1NLgYizCyhVp8gzCxNFEK46CcToW9BzaGmj2MtkfI5bzvWODP9YY0zY4k0snNfLXOzMxmIXR81suujRhfgAPYAlYCHW0TXdQVYccnnsbsq1uCqKOOSz8NgXPJ5cFWsYfLy4mKggH4yEvo6gD3H3S1PAhFfnL9A2sRxRIWHEagvWtpo7QT1gQz6q8Z5mBrnYQ1YAFQBTqCDW0TXdRk47KooUz4qXEDzB9V0X+xgKPiOOrnniaeVl15dvUnTNA/9YGB4cAIL3M0+ery6eT8v/vg3rH/Hybv7P+Xd/Z9Sc6iJ4+4WjrtbOO5u4bi7hePuFmoONXHO2059QyOhSAjhAsrxu+TzMJQu+Ty4KtbgV0w/mRg+HECBu9lXDMjtnV2c87ZT13CGq7gAF39uD5wpZgDSku/Bbza3lzY+z24/vk7jks/DUHJVlDF5ebFd13VNCOEiQCaGl3KgnIFZXN/QKKclJ9EflphobjchhEvX9XJ5YaH9+LoShtIlnwd3VTnWPHsxUECADIzo5XKfbqa/0pKT8FMBhdtLkxeuIMwsMdSOr9Pws+u6LhMgAyMkoBC/+obP6C9LTBT/YTegcJsIIVxhZqlcXljIUGtvcuGuKsevmAAZuLMpwAl1hihVZwiVAcpSUpEThQTsBiRun03ywhWEmSWG2vF1Gn52XddlAmBkeLAD24EyoAQoAUoAFbADCjCTP/HwBz8tWW5I2fiykT214Dyq83juLPqrvqGR0dGfkjJRRBw5QQqwhdtA0zTXS6+uVrsvdsrnax0MpS6fh8hEGUuKImmaVsUNmAh9ElC6vcwoSRZwnQJ7nsDjA+dRXcVvzwFddTWBq0kvdh7R8fjo4ZDMqCsWGugxO1Pw/m/P4m1twxITRX94W9tQpgpWLDTgONBl8/iwAy6uzQl4uDk0eeEK1VVRxiWfh6F0fJ2GNc9u13VdE0K4uA4Toa9QnSEkW47AUauzpqIbbR2UPmfAliPooWYKruRqAleTrs5ZchmPDyQz2PMEm945S2n5Lyh+ZhH9UeM8zA+WCiQzFC40UF6lb5THc02OAzpXcAEuYBNQziAJIRy6rjvkhYXq8XUlDKX2Jhfnax2MzVSLgQKuw0Rok4AVxcsN9FAzBR9vNVK5S6fgxcvsqTVQ+pyBq8mJICcK7HkGtHXdbHzZQI/tZUYm5lYzU0llbnYmgahvaMRkOIsy1Ugve56geLmBQDhqddl1CrngxcsqUAl4GDxNXrhCdVWUccnnYShY8+xMXl5MZKLsAqq4ASOhbaU6Q+SWLDdwpZSJgicfNvDahm6OuiD3QUFflBRBwYuXsecZkMwQEQ4pEwXLX3KiPpBB3FiJG1n9b1t4IP0kuQ8Keuyp1emhzhAEouDFbsqeM1B3VOfICb4AahgkTdNcL726Wu2+2Cmfr3UwGNY8O9PXbMeaZ3eFmaUiIUSBpmlHuAEDoW1x8XIDfZETYfsaI+VV3VTu0umLnAiFCw0UvHiZXrYcwfcWdfDtF0rxtrZxPe7TzWyr3suKhQZ6eXwEzOMDxwGdHovnG/BbzNDR5IUrCDNLDIQ1z86c6hNMe3mjMzJRLhBCTBRClBMgI6HLrs4Q9pLlBq5FMkPKREHR690ULjTQl6xpgu+XdZMyUZAyUdBDnSH43bE21myuY37OTMJHhdGXb79QSv7fnOfJXEGv197sJm+OgZSJghup+Z1O3RF4+gkDKRMFayq6EzouUgWcZpA0TXO99Opqtftip3y+1kGgrHl2pq/ZjjXP7ggzSwVCiO9rmuaknwyEruLF8w3ciC1HII+H8iqdvkhm2PiykYIXL+Px8UcbXzbwQPpJHnxyBTXOw1zt2dXr6Wg/QvFyA1dyHtGRxxMwycIf2fMM+K1g6GjywhWEmSWuJ8wsMXl5CV//oIVpL290RCbKc4QQc4QQDgbISGiyy4nCXr7KQGAEayq6efoJA31JmSg46oL1W7ux5xnoZcsR3D2ui2dW7aHhs7MI4OP6Br79Qikd7UfY/aYRycwfuZpg/dZuyp4zEghXE+yp1bHnGeiRMA7Wb9Vl4DWGgKZprpdeXa12nvtC9hys4WphZolJS1eivP5T4h7MdRjDIwqEEJqfi0EyEZqKi5cbCJQtR1Dwoo7HB5KZPpU+Z2DOkssUvd5N6XMGetnzBLYcE+VV+/hJ1W+QzPDydw3Y84xcrXJXN+oMQaD2HNBRpgp6KVMFylQhOY/qdqCcoaFNXLhCdVWU0SvMLCEvLEReuIIws+QANCGEgyFkJPTY5URhL19lIFAR4VC1S0dJEciJgr5EhENWhqDo9W4SxgmUFEGviHDImiaw5xl4MteAkiLoy/KXu1mcZ0BJEQRi0zs6UydC1jRBr46LsOMDHb8tDAFN01yr3ihT25sa5fYmF5OWrkR5/afEPZjrMIZHFAghND8XQ8xE6CkuXm6gvzauMiAnCq5HmSrY/aaROUsuA0bseYJAOY/quJp0bDmCQDkO6CzOM3Ale56Bote7bYAMuBgaWupzpWrqc6WEmSUHoAkhHNxERkKLXU4U9vJVBvorYZwgIpwbShgnSJkoWL7qMgnjBEqKIBDf/Mdunsw1kPugIBDOozrrt3bzwxeNXCkiHBqbwHlU/xJwMAQ0TXO99OpqyRge8X0hhObn4iYzElq2lz5nlJQUwc2UMlGQmy345nOX+eIc5D4ouJ7yKp1NVd389HUjEeEEpOOiIGuaIGWioC9bqnUZWMMQ0TRth6ZpLm4RI6HDLicKe/kqA7dCwjjBkw8beG1DN+u36qTcK5ATBVcrr9IpePEy7/3QSMpEQaAkM0SECyQzfyFlomBTlS55fOwBXIQgI6Fje+lzRklJEQxEWUU3R06AkiIIlGSGp58w0HERlr/czZZqnS/OAQIqd+l8f003m6q6ee+HRtRMQX+4muC+x7tYudRAX770gaNWx6+KEGQgNJSoM4RszxMM1J5anYEqXGig5QMTxcsN9NDWdVN3FBbPN3Ci2oSaKegvORE8PvD46NPiPAN+dkAiBJkIfhKwoni5gcFwHoHi5QyKLUdgyxEUcwNGCS57uBF1hsB5VEfNFFxNTgRbjqByl24HyggxBoJfqS1HSGqmYKA8PnA16ShTBTfdmKdg3D8QCMkMrlNcU94cA36LCUEGgpsqmbFvfNnIYDiP6qgzBDfdmKfAugGiZxEIZaqgsUnnWux5AsmMAiiEGBPBSwI2lj5nRDIzKHsO6ChTBTeVZT5YN9Afo81Qd5TrsucZKKvoXgEUMLRkwAbMBiT+nAY4GAQTwWu7Pc8g2/MEg+U8qpM3x8BNE5EB1g30l5IiqNrdzfWsWGigrKLbBhQBHgZPBkotMVG2udmZzFRSsSbE0Utbu5n6hsY9gINBMBF8JGC7MlWopc8ZGArOI1C8nJsjIgPufR+MEn8UJhMIyQyuU1yXnAjqDCE5Dug2oJyBkQEVmA3YluTnSkX2x7DERNGrvqGRZ1evp76h0QmUMUgmgo8HkFcsNCCZGTSPD1xNOspUwZCLyIB73wejxJ8ZlUQglKkCV5POjSyeb8Bx4PIKoJzA2YA8QLXERMmWmGi8rRd4Y+Uy5mZncqVt1XvR1m7G29qmASUMARPBqUhb173dlmNEMjMozqM6ylTBkIvIgHvfB6PEYHl8IJm5JnueoOh1FI8PBXByfaWAPS05SZqXncnc7OmkJSfhbW3D23oBa0IcV3p29Xq2Ve/1AHMAJ0PESHA64vGhdl5Ezn1QMBibqnQiwgW2HMGQiciAe98Ho8Q1nXmZQOyp1UmZKJATBdfzxTmoOahHAFVcmz0tOWl15b9qEd/52/lkKanEjZXoET4qDEtMNL28rW0889JafrlrvxO4D3AxhAwEr4Kyim6Po1ZnMFxNkDGVoRORAfe+D0aJ64qezVBasdCAnx2Q+BMZUAEJsAOlS/NzsSbEcSPfKFzFzn21TmAO4GGImQheLqBowYrLG09Um5DMDIjziM7iPANDIiID7n0fjBJDRTKD6xSQyXVJZrDlCCp36RsBFZAsMVFYE+Kob2jEmhCH+3Qzc7MzuZEa52HqGxpdwBzAw01gIriVe3zMnrPksn33m0YkM/3mPKqjZgoGzSjBhA1glBhKylRBY5MOCPri8YG2rpuyim7mZmfyxsrptiwlFWtCHD2+/UIpPd5YuQxt7WYsMVHcSI3zMH4OwMNNYiL4FTiP6tKcJZdtu980IpkJmKNWR5kqGDSjBPe+DxEZ9OmyB4wSf8Y4msFyHtVZsKKbKfdO54OfLcSaEMeVapyHqXHW88HP1mCJiWJL2QsEYr+zHj8ZkPmDYkAGXMAawMkgGQkNO06f48kdH+jSkw8biAgnIJW7dPbUQuFCAwNmlODe9yEigz511MEomb9w8Rhc2MON7KnVcTWBLUdwJedRnTlLLrPsm4sofmYRlphorrZhWzVpyUnMy86kP2YqqXhb22T36ebCzouXCpfk5yor/8uTMqDUNzTmAmsYJAOhwQNI8XHTmZjbReUunUDUHQVXk07lLp0BMUpw7/sQkUGfLnugvY7BmD1D4GrSuZLHBwtWdLNi8SKW5OdyLfUNjczLzqQ/vK1t7Nz3IfOyp2OJiab4mUUUP7OILCWVednT8fMwBEyEBsWaECf9aFURO/fV8verK1jzk7Os+DsDthzBtTiP6PhVbnqn22bLMdIvRgnufR8iMrimc/8C0lMMtTUV3STEp7AkP5frqXEeJi05iUB4W9uob2jk2y/8E1lKGvUNjfRYkp9Lrw3bqvHbxBAwERrULCWVHnOzM8lS0thWvZe/X11NwYvNqDMEylRBL1cTOA7ouJp0D6A5Dug2+sMowb3vQ0QG13SxEdqdEP8ifYrIYCA8Piir6Gb9y48RCEtMFIF48MkV9MhS0vjRqiLcp5t58MlCerlPN1PjPIxfOUPARGiYnZ6cRC9LTBRL8nNZkp9LfUMj9Q2NuE+f5eTpZrZV7/UAGuAAnPh5fDgdtbqiZgpuyCjBve9DRAbX9fn3wJLHNRlHEyiPl6+UV+lo67pJvCuJLCWVofS7f/8RDz5ZSPEzC+lhTYjjSu7TZ/FzAB6GgInQoGYpqfQlLTmJtOQkery5rZpt4ADK+HOOPQd0Rc0U3JB1A0RkcF0X9oD3HbBuYLDUTIHzqI6Y1kVachJd3W08njuLQFgT4qhvaCQtOYle3tY26hsascREkZacxJU++FkZvbytbfTQ1m7G29rGzn21+O1hiJgIUrquK/gJITyWmCgpLTmJG9nvPIxfFX9pj6NWLyzmBqwbwDKfG/riZRjzFBglrsko0U+Ox3NnqVur95KWnEQgspRUdu77kLTkJHp9o3AVPdynmymyP8aS/Fy8rW3UNzSSpaTSa+e+Wvycb26rruIPKgEnQ8RE8PrYdaEZXdf5fcNxYmOMdHVeoNNzhoutLXR3XeRK3tY2du6rxc/BX3I4Duhcl3UDjHmKG2p5Cy7sgXG/4LoiMuinTfudh9X6hkaylFQCsTQ/l28UrmJu9nTSkpPYVr0Xb2sbH/ysjPqGRh7+1vPMzZ7Ohm3VvLmtmiwlleJnFmGJiUJbuxk/DajkJjAShHRdV1wXmp+eWLWcNUff5f90fkb9pS9pCQ/nUuxdTEtViU64l6hxEzBFRmMwjcJ55ARb3tnpBF7jL3UANnWGSJATBX3qqINLjaB3QvhU+nTZAyf/DhBg3cANnXmZQGjruvEr+PSzppWNjp8QqLixEvFjJZ55aS0XL3ax33mY+TkzuS8tmbixEu7TZ3lp7WZqnIedwDfdp882/uSdXytvbquO6Lx4qQxYw01iIjjJrgtn6OG5eAHHF4dwfHGIKyljZOToeJQxMrPvSue+JxehL/2eAuwGXEAd4AScQggP4HQe0RU1U9Cni41w9p/h7D/zFct8sORB9GwYlcRXzv0LXGyEMU9xE3jw87a2YYmJIlD5ubM41NBIafkv8PMszc+V+A8TEuLwtrZVAgv4AwdQwi1gIjgpe744xPU4W1w4W1xUuv8P/I6vSKOiUcbIqhqfTlJ0PMoYGWWMjK7rrt/+9rfs3/F94DcExPsOeN/hKxEZEDMbWt7iK9GzCUhEBnTU0Q+Vz65ebyt+ZiHWhDgCsa16L29uq/YABcB2S0wUvdKS78FP4jYwEZxmO1tc9Jfn4gUcXxzC8cUhrqSMkeXS6QUQmQH8hn7rqIOOOv7IvRTOvATRs8GSB5b59Mko0U8FO/fVenbuq7Xn586iyP4o1oQ4+uJtbUNbu5lt1Xs9wBzACVRu2FZtW5qfiyUmiq3Vv8FvD7eBieAkuy6cYag4W1xIYdFU/S8n9gdBMjM4RgkMErS8BS1v8RXLfLDkgWU+GCUGyAMUANq26r3F26r32vNzZzEvezpzszPpVeM8zLOr1+M+3ewAFgAe/qBgW/Vez7bqvTb+oBIo4zYwEWR0XZcA2dniYigpY2QcDofTedSoqJmCQbnsgbRmuNgI3ipoeQu874D3Hb4SkQFjnoLLHgbIBRQA2rbqvfZt1XsXW2Ki5LTkJLytbdQ3NHoADSjjz3mAAqCA28xE8FEcZw4xlJQxMn4uwOk8oitqpmDQOuogIgPG/QOMkqHxMf6oow4+f5Yh4AJKgBJva5tc4zws8wcOgpyJ4KO6WpsZSsqYifg5gca6owyN9jqIyOArLZu4BVyAixBhIPgk1bWcYCjJ0XH41QEOV5POkOio4ysXG8H7DoOhTBX4qQwjJoKDDMiAfP78edXpcTGUZt+Vjp8TcDoO6AyJ1j18xfMWgyVZGHZM3F4KUGqJiVLTkpPoMXbsWJwtLoaSIsn4OQEP4HE1IcmJDE5HHV9p2cRgSWZ6KICDYcLE7WMHSovsj0mF9kfpMSpmDK4LzXguXmCoyNHxSKOiEUK4+AOnq0lX5UTBoH3+LFxsZLCUqYLKXbrEMGLi9rBbYqI2/mjV98hSUukVFjOGmpYTDCU5Jg4/B3/i2nNAR80UDNrZf2YIjWYYMXDr2S0xURu3lL1AlpLKlUwR0dS1uBhKanw6fk7+pNHjI6jMniHwUxhGDNxaCrBxS9kLpCUncaX6hkYiRt+Fs8XFUMoYI+PXyJ84nEd1gpDEMGLi1iotfmYRaclJ9PC2trFzXy2l5W/jbb1Ay+Jncba46NPhZogKgySJ/pCj4/FzcgXXKYKKminwUxhGTNxaqiUmije3VbPfeZgaZz3e1jYHsCk9PX2xwTRKdV04w595+zC8d5y0xETcp5vx/l0aZCZCbROcbYN7RkNmIteijJERQjj4E4erSSdISYCHYcDErbXg2dXrFwMeoA6oBFz4FRcX4zhzSKVXcxuU7ictbDTFr/4jWUoq26r38uyGzfB2PVnjk5ippLHhR+/hxS8zkaupd6Xj56QPHh9IZoKGMlXgPKorgINhwMStVQlU0ofHH39c3rDHxVcaPbBqL0v+74cofmYRvbytbVjaofiZReTnzqJX6WeHIS4K3j4M46JgUQY95Oh4/Fz8JYfzqK6qmYJgIVnoITFMGAgeGQ+nyJSY5sDzv+aNf1hC8TOL6OVtbWPDtmp+tOp75OfOotehhkZovgCr9lKc9RBW55ewt5EeGWNk/OoIAWqmwE9hmDARJIQQBaqq2t7+8X/n6z8rw5oQx5W0tZuxJowjS0ml1859tezcV0uPN1YuIz93Ft7WNkoP18KsJJQxMn4OQsdohgkTwUPp8HyBz30Ua0IcvbytbWhrN1Pf0MiWshfo5T7dzLOr15OfOwtLTBT5ubPokaWkwm/30kORZPxchIDZMwSsQ2GYMBE8VGtCHFfytrbxjcJV9NhS9gKWmCh6Pbt6Pfm5syh+ZhFXqnEeRk2fgXzvHKRR0R4hhIsQIJnpITNMmAge5duq964ApAkJcfTYWr0X9+lm3vvxq1hiouj17Or1eFvbKLI/xpXqGxrZsO09Sl5aVVaU9V0FcNE3WTITVJSpAj+ZYUIQXGTABkjAaGAPoFhiooqLn1mENSGOHftqeXNbtQeQ8nNnkZ6cRFpyEjv21fLmtmr8CoByrk0GTugHTQSbibmXcTXp9wFOQpyJ4OICyvhzld7WNsezq9evABTACRQA0rbqvbZtMBuQACewBnBxfao6QxCM5PHgakIGnIQ4E6HBATj4cx6gDCijf2bnzREEIzVT4DigK0AlIc7AncdmyzEQjEab6ZHBMGDgzmJTpgpJTiQoKSkCP5lhwMCdJW9xniBYKVMFfgrDgIE7i82WYyBYSWaQEwV+CiHOwJ3DpkwVkpxIUJPH00MhxBm4cygeH7iaCFoeH0hmesiEOCN3DqfHR8Smqu6siHDImiYIJuVVOg8vv4zzKJXAa4CHECa486hAqZwolOLlBux5gtvJeVSn6PVuHAd0F1AEVDIMCO5cdqBYThRy8XID9jzBreTxQdHr3ZRXdXuANUAZ4GGYEIywA8VyopDteYLFeQbkRG4ajw/WVHRTVtGNx0c5oAEuhhnBiF4qsAKw2XIEeXMM2HIEkpkh4fHBmopuyiq68fhwABrgYJgSjLiaBNiBxYBiyxHkzTGgzhDIifSbqwk2VXVTVtGNx4cD0AAHw5xgxPXIgA2YDdjkRIE6QzA7UyCPBzVT0BdXEzgO6FTt7qZyl45fObAGcHKHEIzoDxVQgQxABhTJDEqKoJfrFLiadPwqgSqgEvBwhxGMGCwZkPkTD+BkxIgRQ+//BzU17FNIW8/eAAAAAElFTkSuQmCC"
  },
  {
    "width": 75,
    "height": 98,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 38,
    "height": 49,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 19,
    "height": 25,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAZCAYAAADTyxWqAAAAAklEQVR4AewaftIAAAQrSURBVK3BC0yUBQDA8f/34OR4P+V1xEs0Hlq+Cp1umamb1TRdzWWycqVhynyks4dDW2qtmdDqUtAayrKVWRnQtKlYIhEpPkB84QOGHsdxHPfguOPuvs7N1u283Fz9fvyfJB5Q1Y/udzPHlOwuLdt4vUK76TI+ZB7A7m/cn2+rYmmzGUEQlA1ANT5EvBRFkSvLLhw58lPHG9xHwQThq7Q4LPEiSCIxiqJk4UPCKyf5xZ2HdvTMb79omVm8ct2o72s/PcA/hgMOwKMt29SxvLgkefqjnF3/ujhbEIRefMh4GXSOyZ4hcNkVMSZe1YbX24sKaqLDgqeKohDuUbA7h9yXrnYZdy4vlIrxKlrIPSS8ao5pD1rcA6lJI4bpFywZ9eraBRN3DVPJ82Mi1OogWUIlS0HqYXJiXKR6Zl5GXGRD661fCEDgXknvLJp0ISkpLWrA1o9Gk06wOhT7oINLF0/bQblV23Dtwz8v6SrwI+OncFbe4lB1UFR6RjYeQUVu1kMgQJfOgFsRpJWbd75ktDquEYCIH018xAhJFBmRkUFedhqyLGG12UnXJDJ54njVrIKRbwJ6AhDxY7U7jeEhKlovtiFLErdMgzhiH0Zv9RAky+Smxz677LmxJQQg4edKp9E6KV+z0GbulgfdKjI1CURgJVQloO/to+f2ZUkSxcy65o59gA0fIn6MVsfJPou9TlEUegwGXC43JrMVk9lCY+NvbqPZ3ljb0F4IdF8/XLPijHb7Hu6SCOD31q7mtITIGR6nmeTULCk+Jkou3/v1ofrT5zfsqj63qstgvdm0teR4Z1XFEtvVy6M3V5RfL62sOicTgNOldM9+6kx3SgKdA0MFkyCOx8cKKa/Mu/HM9BMEr/2YSlGl0rl1TSJevefPFQJ7ZQI4UiFsfGIiU/vMoDfuYdBmoGD04fyYSPKnPSbkgFI5pmjlFqfJNF6dmHj8kWWr36d4HQL3ytQdE+oTYknsM0N4KPQYISLqaTzOGpxDOJ9fo8w61kQdEA3kACfxkvDzyXph8ZRxzJUkBIsNwkMhfHgJqtRVBFk/wz6IlJ1WkDJ7WuH8FYvmbhmXm237+demo3iJ+Fmx1aP940Lx7Zb2J3tEAQshb0FKEcihiCK0tM9Q4hJenpGXnT7H5XLFh4UGZ3GXjJ/yU99+1BYdmSJ6puhfEzSuOLcJDLUQNoY7BpwZZ8Ld7uT6Uy0dLVduHNixr/oD7pLx8cWWNcWO7s45pf2teA1/ISyxDYc2GncnmLTcERJUXjdhnrKaAGR8mMxWIczkHqgwZHBWZVdCou3NQA6uav6WEEsy/0LCx6ETpxoFk1UXHxZxMzdM80NqxPaRcVGMwsfAIH2lVXxJADJ+Dh5t2H/waMN+vOr3CCn6XnpiooiXJejtp1/XQzP/gbypiKXfbeM9IJ/7+AuzrabHKJK6DwAAAABJRU5ErkJggg=="
  },
  {
    "width": 10,
    "height": 13,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAANCAYAAACQN/8FAAAAAklEQVR4AewaftIAAAGcSURBVGPABRom/G06deWfBgMUMP3//59p+cwbBQxIYMnGv6EbjjBUrtv6v4gBCpiluULbDy1/21hRX/naUOJChqeFUuaLy3M/2XkmbqnMZKpvbGz8zwAELKll2m3MLFd/XzgQqy0iJJQkLCTCyPHlk8uDbZaTGWNP/WOAAkYGKGhKtjnv6h5qIMzPx/Dh0+d/3dNmJq3ef3UhAxQwMUABFzvr1/fvXjH8ZOZi4OHlYzJUFaljYGDgYYACZgYoMFaXYPz08ZODmpIi6+VrVy89ffpwRou9Z16ihYn3/JNnN7AwQIGz3YnXGkoMHz5+V+c20dwoIC1yl/3vCTVRRhYWTgYgYGKAAj01hixBPgY5ZZlLzDKKIfKyElIR303Urx5nZ5jOAAQsDFCw4WMDq/7Pa2/NtP2EGf7/ZHj6LkmBkZGBS0xE4AgDELAwAMG0+tyAl5++Gx38zvPJ7H2rMMP/zwzsTE9arJMZ+hmggJkBCLYePHXDRlLhjpvcgxeiAmct//3/9P/rd4bjU5YzHGLABRoyGMyWtTN4MKABANzIj5111/jOAAAAAElFTkSuQmCC"
  }
];
mipmaps.forEach( mipmap => {
  mipmap.img = new Image();
  const unlock = SimLauncher.createLock( mipmap.img );
  mipmap.img.onload = unlock;
  mipmap.img.src = mipmap.url; // trigger the loading of the image for its level
  mipmap.canvas = document.createElement( 'canvas' );
  mipmap.canvas.width = mipmap.width;
  mipmap.canvas.height = mipmap.height;
  const context = mipmap.canvas.getContext( '2d' );
  mipmap.updateCanvas = () => {
    if ( mipmap.img.complete && ( typeof mipmap.img.naturalWidth === 'undefined' || mipmap.img.naturalWidth > 0 ) ) {
      context.drawImage( mipmap.img, 0, 0 );
      delete mipmap.updateCanvas;
    }
  };
} );
export default mipmaps;