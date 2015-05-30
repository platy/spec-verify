Managing issues in git
======================

I was reading Chris Ball's very interesting 
[post on GitTorrent](http://blog.printf.net/articles/2015/05/29/announcing-gittorrent-a-decentralized-github/).
In it he talks about how he managed to get git hosted on bittorrent, how the blockchain could be used to provide 
username namespaces - the idea being that these are the most important things we use github for, but decentralised.

Another thing he brought up that we use github for - is bug tracking - and one way to make this distributable is to have 
a file based bug tracker stored in the git repo - mentioning [Bugs Everywhere](http://bugseverywhere.org/). I was really
interested in this, I often use github for bugs / tasks if I don't have to use anything else
 
- it's simple 
- I don't need to log into anything else
- issues can link to commits and vv
- it has some really nice features that I barely use
- users can leave issues

but sometimes I just put tasks in a readme file, because it's even easier. When the issues are in repo with the source
I'm sure we can get the first 3, and probably a lot of the really nice features. Having an easy way for users to leave 
issues might require a web interface, but that could come. Additionally:

- the tasks can be updated at the same time as the code
- at code review, or merge, the tasks completed can be seen in diff with the code changes
- accessible offline
- we can build our own tools and extensions
- we can build the status into documentation at release time / build into the project website

Existing systems
----------------

[Bugs Everywhere](http://bugseverywhere.org/)

This is an interesting project and I plan to try it out, but it's not what I want because the database format is 
machine readable first - designed to be read by software. I think that making it usable by both is doable - there are
probably some things that are going to be more difficult for the software this way but we might be able to use more 
existing tools.

[Ditz](http://ditz.rubyforge.org/)

I couldn't find the source or an example of the bug database, but it does have a nice [html view](http://ditz.rubyforge.org/ditz/)

[Artemis](https://mercurial.selenic.com/wiki/ArtemisExtension)


[The most recent roundup of what's out there in DITs][https://www.stationary-traveller.eu/distributed-bug-trackers.html]


Design of this bug database
---------------------------

The database lives under a directory `issues`, this is designed for humans so I don't think it should be `.issues` or `mydit`.

Under `issues` the directories represent issue status, recommended statuses are `open`, `closed`, `inprogress`. Tools 
should handle these statuses as expected by default, but should allow other statuses - even in other languages, we'll
 have to work out a way to configure that.

Status directories can be suffixed with `:<author>`, ie. `inprogress:platy` or `closed:Mike`. Status directories in this 
way mean that task status change and assignment will appear in VCS history as 
'file moved from issues/open to issues/inprogress:platy' so we get issue history for free!

Inside status directories we put the issues, they are named as their issue title - separating words with spaces!! This
is supposed to be human readable!

The issues are markdown files, containing the body of the issue. We need formatting for the bug messages, I'm not ready 
to give up GFM for writing bug reports. Something extra might be needed for other pieces of data but lets try out the 
simplest form first.

Other things that we'll need in the db:

- Comments: probably have a format for appending them to the markdown body
- tags
- milestones

Tools we might want:

- Web interface for non-collaborators
- Text editor plugins for collaborators
- Notifications for assigned (/watched?) issues : maybe a git hook for the first version?
- Status page generators : maybe in jekyll